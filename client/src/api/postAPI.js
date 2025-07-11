// src/api/postAPI.js
import axios from "./axios";

export const createPost = async (data) => {
  const res = await axios.post("/posts", data);
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axios.get("/posts");
  return res.data;
};
