export default function ChatSidebar({ rooms, activeRoom, openChat, currentUserId }) {
  return (
    <aside className="flex flex-col w-full bg-white h-full overflow-hidden">
      <div className="flex items-center px-5 py-6 border-b shrink-0">
        <h1 className="font-bold text-2xl tracking-tight text-indigo-600">Messages</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <p className="p-4 text-center text-gray-400 text-sm">No chats found</p>
        ) : (
          rooms.map((room) => {
            const otherUser = room.members.find(
              (m) => m._id.toString() !== currentUserId?.toString()
            );

            return (
              <button
                key={room._id}
                onClick={() => openChat(room)}
                className={`w-full flex flex-row items-center p-4 transition-colors border-l-4 shrink-0 ${
                  activeRoom?._id === room._id 
                  ? "bg-indigo-50 border-indigo-500" 
                  : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {otherUser?.profilePic ? (
                    <img src={otherUser.profilePic} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <span className="text-indigo-600 font-semibold">{otherUser?.firstName?.[0]}</span>
                  )}
                </div>
                <div className="ml-3 text-left overflow-hidden flex-1">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {otherUser?.firstName} {otherUser?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {room.lastMessage || "Click to start chatting"}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}