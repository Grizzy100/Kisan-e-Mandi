import express from "express";
import {
    registerWithEmail,
    verifyEmail,
    loginWithEmail,
    verifyPhone,
    checkAvailability,
    getMe,
    googleLogin,
    forgotPassword,
    resetPassword,
    resendVerification,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────
router.post("/check-availability", checkAvailability); // Real-time email/phone duplicate check
router.post("/register", registerWithEmail);           // Email + password signup
router.post("/verify-email", verifyEmail);             // Verify email token from link
router.post("/login", loginWithEmail);                 // Email + password login
router.post("/verify-phone", verifyPhone);             // Firebase Phone OTP → JWT
router.post("/google", googleLogin);                   // Google OAuth
router.post("/forgot-password", forgotPassword);       // Request password reset email
router.post("/reset-password", resetPassword);         // Submit new password via token
router.post("/resend-verification", resendVerification); // Resend email verify link

// ── Protected routes ───────────────────────────────────────────
router.get("/me", protect, getMe);

export default router;
