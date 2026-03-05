import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  getAllUsers,
  suspendUser,
  deleteUser,
  getAdminStats,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

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
// @desc    Get all users, optionally filtered by ?role=farmer|customer
// @access  Admin only
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// @route   GET /api/users/stats
// @desc    Admin platform analytics
// @access  Admin only
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// @route   PATCH /api/users/:id/suspend
// @desc    Toggle suspend a user account
// @access  Admin only
router.patch("/:id/suspend", protect, authorizeRoles("admin"), suspendUser);

// @route   DELETE /api/users/:id
// @desc    Permanently delete a user and their data
// @access  Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
