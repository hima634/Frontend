import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Main instance for all app requests
const api = axios.create({
  baseURL:BASE_URL,
  withCredentials: true,
});

// Clean instance for refresh token ONLY (avoids interceptors)
export const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
