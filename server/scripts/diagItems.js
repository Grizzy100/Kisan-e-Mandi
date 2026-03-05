import "dotenv/config";
import mongoose from "mongoose";
import Item from "../models/Item.js";
import SupportTicket from "../models/SupportTicket.js";

const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to:", MONGO_URI ? MONGO_URI.substring(0, 30) + "..." : "MISSING!");

await mongoose.connect(MONGO_URI);
console.log("Connected.\n");

// ── Check tickets ────────────────────────────────────────────────
const tickets = await SupportTicket.find({}, "subject category status price mediaUrl mediaType description userId createdAt").sort({ createdAt: -1 });
console.log(`Total tickets in DB: ${tickets.length}`);
tickets.forEach((t) => {
  console.log(`  [${t.status}] ${t.subject} | ₹${t.price} | cat=${t.category} | hasMedia=${!!t.mediaUrl} | userId=${t.userId}`);
});
console.log();

// ── Fix: create missing Items for resolved tickets ──────────────
const mapCategoryToCropType = (cat) => {
  const c = (cat || "").toLowerCase();
  if (c === "wheat" || c === "rice") return "grain";
  if (c === "vegetables") return "vegetable";
  if (c === "fruits") return "fruit";
  return "other";
};

const resolvedTickets = tickets.filter((t) => t.status === "resolved");
for (const t of resolvedTickets) {
  const existingItem = await Item.findOne({ ticketId: t._id });
  if (!existingItem) {
    console.log(`\n⚠️  Resolved ticket "${t.subject}" has NO linked Item. Creating it now...`);
    const newItem = await Item.create({
      ticketId: t._id,
      sellerId: t.userId,
      name: t.subject,
      description: t.description || t.subject,
      cropType: mapCategoryToCropType(t.category),
      ticketCategory: t.category,   // preserve original label e.g. "Rice"
      cropName: t.subject,
      price: Number(t.price),
      mediaUrl: t.mediaUrl || "",
      mediaType: t.mediaType || "image",
      status: "published",
      isActive: true,
    });
    console.log(`✅ Created Item: ${newItem._id} (${newItem.name}) → published+active`);
  } else {
    console.log(`\n✓ Ticket "${t.subject}" already has linked Item (status: ${existingItem.status}, isActive: ${existingItem.isActive})`);
  }
}

const allItems = await Item.find({}, "name status isActive ticketId price mediaUrl cropType").sort({ createdAt: -1 });
console.log(`Total items in DB: ${allItems.length}`);
allItems.forEach((i) => {
  console.log(
    `  [${i.status}] isActive=${i.isActive} hasTicket=${!!i.ticketId} hasMedia=${!!i.mediaUrl} | ${i.name} | ₹${i.price} | cropType=${i.cropType}`
  );
});

// Count by status
const counts = allItems.reduce((acc, i) => {
  acc[i.status] = (acc[i.status] || 0) + 1;
  return acc;
}, {});
console.log("\nSummary by status:", counts);

// Check how many would show in marketplace
const published = allItems.filter(
  (i) => i.isActive && i.status === "published" && i.ticketId
);
console.log(`\nWould appear in marketplace (isActive+published+hasTicket): ${published.length}`);

// Check for stale approved_hidden
const stale = allItems.filter((i) => i.status === "approved_hidden");
if (stale.length > 0) {
  console.log(`\n⚠️  STALE ITEMS (approved_hidden, not showing in marketplace): ${stale.length}`);
  stale.forEach((i) => console.log(`  - ${i.name} | ₹${i.price}`));

  // Auto-fix them
  const fix = await Item.updateMany(
    { status: "approved_hidden" },
    { $set: { status: "published", isActive: true } }
  );
  console.log(`✅ Fixed ${fix.modifiedCount} stale items → published+active`);
} else {
  console.log("\n✓ No stale approved_hidden items.");
}

// Also check pending_admin items
const pending = allItems.filter((i) => i.status === "pending_admin");
if (pending.length > 0) {
  console.log(`\nℹ️  Pending admin review: ${pending.length}`);
  pending.forEach((i) => console.log(`  - ${i.name} | ₹${i.price}`));
}

await mongoose.disconnect();
process.exit(0);
