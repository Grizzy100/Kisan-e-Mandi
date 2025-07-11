import User from "../models/User.js";

/**
 * Get current logged-in user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Update current user's profile
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * (Optional) Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error." });
  }
};
