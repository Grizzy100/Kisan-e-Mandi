// src/api/supportAPI.js
import axios from "./axios";

export const createSupportTicket = async (data) => {
  const res = await axios.post("/support", data);
  return res.data;
};
