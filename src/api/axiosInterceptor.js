import api from "./api";
import { refreshToken } from "./refreshToken";

let isRefreshing = false;
let failedQueue = [];

// Resolve / Reject all queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = () => {
  // =========================
  // REQUEST INTERCEPTOR
  // =========================
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // =========================
  // RESPONSE INTERCEPTOR
  // =========================
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // ❌ If no response → network error
      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;

      // ======================================
      // ❌ STOP if refresh-token itself failed
      // ======================================
      if (originalRequest.url.includes("/user/refresh-token")) {
        localStorage.removeItem("accessToken");

        // 🚫 DO NOT redirect automatically
        return Promise.reject(error);
      }

      // ======================================
      // 🔁 HANDLE 401 (Access Token Expired)
      // ======================================
      if (status === 401 && !originalRequest._retry) {
        // If refresh already running → queue request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshToken();

          // ❌ Refresh failed → just reject (NO redirect)
          if (!newToken) {
            localStorage.removeItem("accessToken");
            processQueue(new Error("Refresh failed"), null);
            return Promise.reject(error);
          }

          // ✅ Save token + retry all queued requests
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // ======================================
      // 🚫 HANDLE 403 (Refresh expired / invalid)
      // ======================================
      if (status === 403) {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};
