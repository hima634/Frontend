import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { getMyChats, getMessages, sendMessageAPI } from "../services/chatService";
import { useSelector } from "react-redux";
import ChatSidebar from "../components/UI/ChatSidebar";
import ChatWindow from "../components/UI/ChatWindow";

export default function Chat() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [image, setImage] = useState(null);

  const currUser = useSelector((state) => state.User.user);
  const currentUserId = currUser?.id || currUser?._id;

  // Use a ref to always have the latest activeRoomId inside socket listeners
  const activeRoomIdRef = useRef(null);
  useEffect(() => {
    activeRoomIdRef.current = activeRoom?._id;
  }, [activeRoom]);

  useEffect(() => {
    socket.connect();
    loadChats();
    return () => socket.disconnect();
  }, []);

  const loadChats = async () => {
    const res = await getMyChats();
    if (res.success) setRooms(res.rooms);
  };

  // Join rooms whenever rooms list updates
  useEffect(() => {
    if (rooms.length > 0) {
      rooms.forEach((room) => socket.emit("join-room", room._id));
    }
  }, [rooms]);

  const openChat = async (room) => {
    setActiveRoom(room);
    setShowSidebar(false); 

    const res = await getMessages(room._id);
    if (res.success) {
      setMessages(res.messages);
      
      // Mark messages as seen when opening
      res.messages.forEach((msg) => {
        const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
        if (senderId !== currentUserId) {
          socket.emit("mark-seen", { roomId: room._id, messageId: msg._id, });
        }
      });
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      // Use the Ref instead of the state to avoid stale closure issues
      if (msg.roomId === activeRoomIdRef.current) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      
        socket.emit("mark-seen", { roomId: msg.roomId, messageId: msg._id,  });
      }

      // Update last message in sidebar
      setRooms((prev) =>
        prev.map((r) => (r._id === msg.roomId ? { ...r, lastMessage: msg.text || "Sent an image" } : r))
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => socket.off("receive-message", handleReceiveMessage);
  }, [currentUserId]); // 

  useEffect(() => {
    const handleMessageSeen = ({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, seenBy: Array.from(new Set([...(msg.seenBy || []), userId])) }
            : msg
        )
      );
    };

    socket.on("message-seen", handleMessageSeen);
    return () => socket.off("message-seen", handleMessageSeen);
  }, []);

  const sendMessage = async () => {
    if (!text.trim() && !image) return;
    if (!activeRoom) return;
  
    const formData = new FormData();
    formData.append("roomId", activeRoom._id);
    formData.append("text", text);
    if (image) formData.append("image", image);
  
    const res = await sendMessageAPI(formData); 
  
    if (res.success) {
      socket.emit("send-message", res.message);
      setMessages((prev) => [...prev, res.message]);
      setText("");
      setImage(null);
    }
  };

  return (
    <div className="fixed inset-0 top-17 flex bg-gray-50 overflow-hidden">
      <div className={`${showSidebar ? "flex" : "hidden"} md:flex w-full md:w-80 border-r shrink-0 h-full flex-col bg-white transition-all`}>
        <ChatSidebar rooms={rooms} activeRoom={activeRoom} openChat={openChat} currentUserId={currentUserId} />
      </div>

      <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-1 h-full flex-col overflow-hidden bg-white`}>
        <ChatWindow
          activeRoom={activeRoom}
          activeUserName={activeRoom?.members?.find(m => m._id.toString() !== currentUserId?.toString())?.firstName}
          messages={messages}
          text={text}
          setText={setText}
          image={image}
          setImage={setImage}
          sendMessage={sendMessage}
          currentUserId={currentUserId}
          onBack={() => setShowSidebar(true)} 
        />
      </div>
    </div>
  );
}