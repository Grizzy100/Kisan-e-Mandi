import axios from "./axios";

// Get current logged-in user
export const getCurrentUser = async () => {
  const res = await axios.get("/users/me");
  return res.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const res = await axios.put("/users/me", data);
  return res.data;
};

// Optional: Admin - get all users
export const getAllUsers = async () => {
  const res = await axios.get("/users");
  return res.data;
};
