import { useEffect, useRef } from "react";

export default function ChatWindow({ activeRoom, messages, text, setText, sendMessage, currentUserId, onBack, setImage, image,activeUserName, }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeRoom) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-gray-400">
        <div className="p-8 bg-white rounded-full shadow-sm mb-4">
          <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-lg font-medium">Select a conversation</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-white h-full relative overflow-hidden">
     {/* HEADER */}
     <div className="flex items-center gap-3 px-4 py-3 md:px-6 border-b shrink-0 z-10">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2 truncate">
          {/* Displays the user's name or "Chat" as a fallback */}
          <div className="font-bold text-gray-800 truncate text-base md:text-lg">
            {activeUserName || "Chat"}
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 min-h-0">
        {messages.map((msg) => {
          const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
          const isMine = senderId?.toString() === currentUserId;
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] md:max-w-[70%]">
                <div className={`shadow-sm rounded-2xl overflow-hidden ${
                  isMine ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"
                }`}>
                  {msg.image && <img src={msg.image} className="w-full max-h-60 object-cover" alt="" />}
                  {msg.text && <p className="text-sm px-4 py-2">{msg.text}</p>}
                </div>
                <div className={`text-[10px] mt-1 flex gap-1 ${isMine ? "justify-end text-indigo-400" : "text-gray-400"}`}>
                  {isMine && <span>{msg.seenBy?.length > 1 ? "✓✓" : "✓"}</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-2 md:p-4 bg-white border-t shrink-0">
        {image && (
          <div className="mb-2 relative inline-block">
            <img src={URL.createObjectURL(image)} className="h-16 w-16 object-cover rounded-lg border shadow" alt="" />
            <button onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[8px]">✕</button>
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 focus-within:ring-2 ring-indigo-500">
          <label className="cursor-pointer p-1">
            📎 <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setImage(e.target.files[0])} />
          </label>

          <input value={text} onChange={(e) => setText(e.target.value)}
           onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Message..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1" />
          <button onClick={sendMessage} disabled={!text.trim() && !image} className={`p-2 rounded-full ${(!text.trim() && !image) ? "text-gray-400" : "text-indigo-600"}`}>
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
          </button>
        </div>
      </div>
    </main>
  );
}