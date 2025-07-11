// src/api/authAPI.js
import axios from "./axios";

// This is called after Firebase login
export const verifyFirebaseToken = async (idToken) => {
  const response = await axios.post("/auth/login", { idToken });
  return response.data;
};
