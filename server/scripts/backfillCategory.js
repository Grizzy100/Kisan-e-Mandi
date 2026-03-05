import "dotenv/config";
import mongoose from "mongoose";
import Item from "../models/Item.js";
import SupportTicket from "../models/SupportTicket.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected.");

const items = await Item.find({ ticketId: { $exists: true, $ne: null } });
console.log(`Items with ticketId: ${items.length}`);

let updated = 0;
for (const item of items) {
  if (item.ticketCategory) {
    console.log(`  ✓ ${item.name} already has ticketCategory: ${item.ticketCategory}`);
    continue;
  }
  const ticket = await SupportTicket.findById(item.ticketId, "category");
  if (ticket?.category) {
    await Item.updateOne({ _id: item._id }, { $set: { ticketCategory: ticket.category } });
    console.log(`  ✅ ${item.name} → ticketCategory: ${ticket.category}`);
    updated++;
  } else {
    console.log(`  ⚠️  No ticket found for item ${item.name}`);
  }
}

console.log(`\nDone. Backfilled ${updated} item(s).`);
await mongoose.disconnect();
process.exit(0);
