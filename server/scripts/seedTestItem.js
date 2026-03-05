/**
 * scripts/seedTestItem.js
 * Run: node scripts/seedTestItem.js
 *
 * Seeds one published test item directly into the DB to verify the marketplace works.
 */

import mongoose from "mongoose";
import "dotenv/config";
import Item from "../models/Item.js";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI not set in .env – aborting.");
  process.exit(1);
}

const run = async () => {
  console.log("🌱  Connecting to MongoDB…");
  await mongoose.connect(`${MONGO_URI}/Kisan-e-Mandi`);
  console.log("✅  Connected");

  // Find any vendor/farmer user to use as sellerId
  const seller = await User.findOne({ role: { $in: ["vendor", "farmer", "user"] } });

  if (!seller) {
    console.error("❌  No vendor/farmer user found. Register a user first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`👤  Using seller: ${seller.name} (${seller.email})`);

  // Check if test item already exists
  const existing = await Item.findOne({ name: "Test Wheat Listing" });
  if (existing) {
    console.log("ℹ️  Test item already exists:", existing._id, "status:", existing.status, "isActive:", existing.isActive);
    // Force it to published
    existing.status = "published";
    existing.isActive = true;
    await existing.save();
    console.log("✅  Forced existing test item to published+active");
    await mongoose.disconnect();
    return;
  }

  const item = await Item.create({
    sellerId: seller._id,
    name: "Test Wheat Listing",
    description: "500kg premium quality wheat grown organically in Punjab.",
    cropType: "grain",
    cropName: "Wheat",
    price: 2200,
    unit: "quintal",
    quantity: 5,
    mediaUrl: "https://placehold.co/400x300?text=Wheat",
    mediaType: "image",
    status: "published",
    isActive: true,
  });

  console.log("✅  Test item created:", item._id);
  console.log("   status:", item.status, "| isActive:", item.isActive);
  console.log("\n🎉  Visit the marketplace — this item should now appear!");

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("❌  Error:", err);
  process.exit(1);
});
