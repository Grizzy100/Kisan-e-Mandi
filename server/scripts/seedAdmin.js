/**
 * seeds/seedAdmin.js
 * Run: npm run seed
 *
 * Creates the root Admin user from environment variables.
 * This should NEVER be exposed via the public registration API.
 */

import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kisan-e-mandi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";

// Pass --force to delete and recreate the admin (resets password)
const FORCE = process.argv.includes("--force");

if (!MONGO_URI) {
    console.error("MONGO_URI not set in .env  – aborting.");
    process.exit(1);
}

const run = async () => {
    console.log("🌱  Starting Admin seed…");
    console.log("   EMAIL   :", ADMIN_EMAIL);
    console.log("   DB URI  :", MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//<credentials>@"));

    await mongoose.connect(`${MONGO_URI}/Kisan-e-Mandi`);
    console.log("✅  Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
        if (!FORCE) {
            console.log("ℹ️   Admin already exists – no action taken. Run with --force to reset the password.");
            await mongoose.disconnect();
            return;
        }
        console.log("⚠️   --force flag set – deleting existing admin and recreating…");
        await User.deleteOne({ email: ADMIN_EMAIL.toLowerCase() });
    }

    // NOTE: Do NOT manually bcrypt.hash the password here.
    // The User model's pre("save") hook handles hashing automatically.
    // Double-hashing would cause login to always fail with "Invalid credentials".
    await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password: ADMIN_PASSWORD,
        role: "admin",
        isEmailVerified: true,
        authProvider: "local",
    });

    console.log(`✅  Admin user created: ${ADMIN_EMAIL}`);
    console.log("   → You can now log in at /admin/login");
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});
