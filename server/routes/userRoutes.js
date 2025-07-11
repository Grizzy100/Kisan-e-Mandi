import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  getAllUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Protected
router.get("/me", protect, getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Protected
router.put("/me", protect, updateCurrentUser);

// @route   GET /api/users
// @desc    Get all users (Optional: Admin-only in future)
// @access  Protected
router.get("/", protect, getAllUsers);

export default router;
