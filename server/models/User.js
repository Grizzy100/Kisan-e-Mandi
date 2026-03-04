import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    // ── Email-based auth ───────────────────────────────────────
    email: {
      type: String,
      unique: true,
      sparse: true,       // allows docs with no email (phone-only users)
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,      // never returned by default in queries
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      select: false,
    },
    emailVerifyExpires: {
      type: Date,
      select: false,
    },

    // ── Phone-based auth (OTP via Twilio Verify) ───────────────
    phone: {
      type: String,
      unique: true,
      sparse: true,       // allows docs with no phone (email-only users)
      trim: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // ── Google OAuth ───────────────────────────────────────────
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "phone"],
      default: "local",
    },

    // ── Password Reset ─────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    // ── Profile ────────────────────────────────────────────────
    avatar: {
      type: String,
    },

    // ── Role-Based Access Control ──────────────────────────────
    // farmer  = vendor portal
    // customer= user/buyer portal
    // admin   = full access
    role: {
      type: String,
      enum: ["farmer", "customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only re-hash if the password field was actually modified
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ─────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
