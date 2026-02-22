import api from "../api/api"; // your axios interceptor

export const getMyChats = async () => {
  const res = await api.get("/chat/my-chats");
  return res.data;
};

export const getMessages = async (roomId) => {
  const res = await api.get(`/chat/messages/${roomId}`);
  return res.data;
};

export const sendMessageAPI = async (data) => {
  const res = await api.post("/chat/send", data);
  return res.data;
};

export const createRoom = async (data) => {
  const res = await api.post("/chat/room", data);
  return res.data;
};
