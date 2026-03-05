// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: attach JWT to every request ───────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle expired / invalid JWT ─────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token has expired or is invalid — clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loops if we're already on a login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login")) {
        // If we were on an admin route, send to admin login, otherwise normal login
        window.location.href = currentPath.startsWith("/admin") ? "/admin/login" : "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

