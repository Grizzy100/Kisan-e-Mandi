import admin from "firebase-admin";
import User from "../models/User.js";

/**
 * @desc Verify Firebase ID token, create or retrieve user profile.
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID token is required." });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    // Find or create user profile in MongoDB
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        name: name || "Unnamed User",
        role: "customer", // or "vendor", depending on your frontend logic
      });
    }

    res.status(200).json({
      message: "User authenticated successfully.",
      user,
    });
  } catch (err) {
    console.error("Error verifying ID token:", err);
    res.status(401).json({ message: "Invalid or expired ID token." });
  }
};
