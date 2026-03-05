import "dotenv/config";
import mongoose from "mongoose";
import Item from "../models/Item.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected.");

// Any item that is published + has a ticketId should go back to approved_hidden
// so the farmer can use the new Accept/Later flow from My Listings tab.
const result = await Item.updateMany(
  { ticketId: { $exists: true, $ne: null }, status: "published", isActive: true },
  { $set: { status: "approved_hidden", isActive: false } }
);

console.log(`Reset ${result.modifiedCount} published ticket-item(s) → approved_hidden (awaiting farmer Accept).`);
await mongoose.disconnect();
process.exit(0);
