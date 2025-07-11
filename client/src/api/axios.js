// src/api/axios.js
import axios from "axios";
import { getAuth } from "firebase/auth"; // ✅ import Firebase Auth

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: add Firebase ID token to each request
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
