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

export const getPost = async (id) => {
  const res = await axios.get(`/posts/${id}`);
  return res.data;
};

export const getMyPosts = async () => {
  const res = await axios.get("/posts/user/me");
  return res.data;
};

export const getSavedPosts = async () => {
  const res = await axios.get("/posts/user/saved");
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await axios.get("/posts/user/stats");
  return res.data;
};

export const toggleLikePost = async (id) => {
  const res = await axios.put(`/posts/${id}/like`);
  return res.data;
};

export const toggleSavePost = async (id) => {
  const res = await axios.put(`/posts/${id}/save`);
  return res.data;
};

export const getComments = async (postId) => {
  const res = await axios.get(`/posts/${postId}/comments`);
  return res.data;
};

export const addComment = async (postId, text, parentId = null) => {
  const res = await axios.post(`/posts/${postId}/comments`, { text, parentId });
  return res.data;
};

export const toggleLikeComment = async (postId, commentId) => {
  const res = await axios.put(`/posts/${postId}/comments/${commentId}/like`);
  return res.data;
};

// Admin
export const getPendingPosts = async () => {
  const res = await axios.get("/posts/admin/pending");
  return res.data;
};

export const approvePost = async (id) => {
  const res = await axios.put(`/posts/admin/${id}/approve`);
  return res.data;
};

export const rejectPost = async (id, reason) => {
  const res = await axios.put(`/posts/admin/${id}/reject`, { reason });
  return res.data;
};
