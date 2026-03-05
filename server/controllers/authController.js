import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import admin from "../config/firebase.js";
import crypto from "crypto";

// ── Nodemailer ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── JWT Helper ─────────────────────────────────────────────────
const generateJWT = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ── Email Helper ───────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER) {
    console.warn("[Email] EMAIL_USER not set – logging to console instead:");
    console.log({ to, subject, html });
    return;
  }
  await transporter.sendMail({
    from: `"Kisan-e-Mandi" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ── Validation Helpers ────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isValidPhone = (v) => /^\+[1-9]\d{7,14}$/.test(v);
const isValidName = (v) => typeof v === "string" && v.trim().length >= 2;

// ─────────────────────────────────────────────────────────────────
// 0. CHECK AVAILABILITY (email or phone — real-time)
//    POST /api/auth/check-availability
// ─────────────────────────────────────────────────────────────────
export const checkAvailability = async (req, res) => {
  const { type, value } = req.body;
  if (!type || !value) return res.status(400).json({ message: "type and value required" });

  try {
    let taken = false;
    if (type === "email") {
      if (!isValidEmail(value)) return res.status(200).json({ available: false, message: "Invalid email format" });
      taken = !!(await User.findOne({ email: value.toLowerCase().trim() }));
    } else if (type === "phone") {
      if (!isValidPhone(value)) return res.status(200).json({ available: false, message: "Invalid phone format" });
      taken = !!(await User.findOne({ phone: value.trim() }));
    } else {
      return res.status(400).json({ message: "type must be 'email' or 'phone'" });
    }
    return res.status(200).json({ available: !taken, message: taken ? "Already registered" : "Available" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 1. REGISTER WITH EMAIL + PASSWORD
//    POST /api/auth/register
// ─────────────────────────────────────────────────────────────────
export const registerWithEmail = async (req, res) => {
  const { name, email, password, role } = req.body;

  // ── Field presence ──
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required" });

  // ── Field format ──
  if (!isValidName(name))
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  if (!isValidEmail(email))
    return res.status(400).json({ message: "Enter a valid email address" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  try {
    // ── Duplicate email check ──
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ field: "email", message: "This email is already registered. Please sign in instead." });
    }

    // Password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({
      name,
      email,
      password,
      role: role === "farmer" ? "farmer" : "customer",
    });

    // Generate a verification token and email it
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${frontendUrl}/verify-email?token=${verifyToken}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Verify your Kisan-e-Mandi account",
      html: `
        <h2>Welcome to Kisan-e-Mandi, ${name}!</h2>
        <p>Please verify your email by clicking the button below. This link expires in 24 hours.</p>
        <a href="${verifyUrl}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px;">Verify Email</a>
        <p style="margin-top:16px;font-size:12px;color:#666;">Or paste this URL in your browser:<br>${verifyUrl}</p>
      `,
    });

    res.status(201).json({
      message: "Registered successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 2. VERIFY EMAIL (clicked from email link)
//    POST /api/auth/verify-email
// ─────────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required" });
  }

  try {
    const user = await User.findOne({
      email,
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: Date.now() },
    }).select("+emailVerifyToken");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    const jwtToken = generateJWT(user._id, user.role);

    res.status(200).json({
      message: "Email verified! You are now logged in.",
      token: jwtToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 3. LOGIN WITH EMAIL + PASSWORD
//    POST /api/auth/login
// ─────────────────────────────────────────────────────────────────
export const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Explicitly include password (it is select:false by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox.",
      });
    }

    const jwtToken = generateJWT(user._id, user.role);

    res.status(200).json({
      message: "Logged in successfully",
      token: jwtToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 4. VERIFY PHONE (Firebase Phone Auth)
//    POST /api/auth/verify-phone
//    Client sends Firebase ID token after successful phone verification
// ─────────────────────────────────────────────────────────────────
export const verifyPhone = async (req, res) => {
  const { idToken, phone, role, name, context } = req.body;
  // context: "register" | "login"  (default: login behavior)

  if (!idToken)
    return res.status(400).json({ message: "Firebase ID token is required" });

  try {
    if (!admin.apps.length)
      return res.status(500).json({ message: "Firebase Admin not configured. Add service account credentials to server .env" });

    // Verify the Firebase ID token using Admin SDK
    const decoded = await admin.auth().verifyIdToken(idToken);

    const phoneNumber = decoded.phone_number || phone;
    if (!phoneNumber)
      return res.status(400).json({ message: "No phone number in token" });

    let user = await User.findOne({ phone: phoneNumber });
    const isNewUser = !user;

    // ── Context guard ──────────────────────────────────────────
    if (context === "register" && !isNewUser) {
      return res.status(409).json({
        field: "phone",
        message: "This phone number is already registered. Please sign in instead.",
      });
    }
    if (context === "login" && isNewUser) {
      return res.status(404).json({
        message: "No account found for this number. Please register first.",
      });
    }

    // ── Register: create new user ──────────────────────────────
    if (isNewUser) {
      if (name && !isValidName(name))
        return res.status(400).json({ message: "Name must be at least 2 characters" });

      user = await User.create({
        phone: phoneNumber,
        name: (name && name.trim()) || ("User " + phoneNumber.slice(-4)),
        role: role === "farmer" ? "farmer" : "customer",
        authProvider: "phone",
        isPhoneVerified: true,
      });
    } else {
      // ── Login: update verification flag ───────────────────────
      user.isPhoneVerified = true;
      await user.save();
    }

    const jwtToken = generateJWT(user._id, user.role);

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "Account created" : "Logged in successfully",
      token: jwtToken,
      isNewUser,
      user: { _id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error("Verify phone error:", error);
    if (error.code === "auth/id-token-expired")
      return res.status(401).json({ message: "Session expired. Please try again." });
    res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 6. GET CURRENT USER (Protected route test)
//    GET /api/auth/me
// ─────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

// ─────────────────────────────────────────────────────────────────
// 7. GOOGLE OAUTH LOGIN / REGISTER
//    POST /api/auth/google
// ─────────────────────────────────────────────────────────────────
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential, role } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  try {
    // 1. Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // 2. Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    const isNewUser = !user;

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        authProvider: "google",
        isEmailVerified: true, // Google already verified the email
        role: role === "farmer" ? "farmer" : "customer",
      });
    } else if (!user.googleId) {
      // Existing email account — link Google to it
      user.googleId = googleId;
      user.authProvider = "google";
      user.isEmailVerified = true;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    const jwtToken = generateJWT(user._id, user.role);

    res.status(200).json({
      message: isNewUser ? "Account created via Google" : "Logged in via Google",
      token: jwtToken,
      isNewUser, // frontend can use this to show a role-picker if needed
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google credential" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 8. FORGOT PASSWORD → send reset link via email
//    POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 anyway to prevent email enumeration attacks
      return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({ message: "This account uses Google Sign-In. No password to reset." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Reset your Kisan-e-Mandi password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Kisan-e-Mandi account.</p>
        <p>Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px;">Reset Password</a>
        <p style="margin-top:16px;font-size:12px;color:#666;">If you didn't request this, ignore this email. Your password won't change.</p>
      `,
    });

    res.status(200).json({ message: "If this email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 9. RESET PASSWORD (using the token from the email link)
//    POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "Email, token, and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ email })
      .select("+resetPasswordToken +resetPasswordExpires");

    if (
      !user ||
      !user.resetPasswordToken ||
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    // The pre-save hook will bcrypt this automatically
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 10. RESEND VERIFICATION EMAIL
//     POST /api/auth/resend-verification
// ─────────────────────────────────────────────────────────────────
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email }).select("+emailVerifyToken +emailVerifyExpires");

    if (!user) return res.status(404).json({ message: "No account found with this email" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email is already verified" });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${frontendUrl}/verify-email?token=${verifyToken}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Verify your Kisan-e-Mandi email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email. This link expires in <strong>24 hours</strong>.</p>
        <a href="${verifyUrl}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px;">Verify Email</a>
      `,
    });

    res.status(200).json({ message: "Verification email resent. Check your inbox." });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// 11. ADMIN LOGIN — strictly admin-only, separate endpoint
//     POST /api/auth/admin-login
// ─────────────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ── Strict role guard: only admins may use this endpoint ──
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. This portal is for administrators only.",
      });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = generateJWT(user._id, user.role);

    res.status(200).json({
      message: "Admin logged in successfully",
      token: jwtToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};
