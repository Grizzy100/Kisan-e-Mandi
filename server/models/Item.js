import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // ── Linked post (auto-created from approved post) ──────────
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    // ── Seller ─────────────────────────────────────────────────
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Product details ────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cropType: {
      type: String,
      enum: ["fruit", "vegetable", "grain", "other"],
      required: true,
    },
    cropName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["kg", "quintal", "ton", "piece", "dozen", "bushel"],
      default: "kg",
    },
    quantity: { type: Number, default: 1 },

    // ── Media ──────────────────────────────────────────────────
    imageUrl: { type: String },
    mediaUrl: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    // ── Location ───────────────────────────────────────────────
    location: { type: String, trim: true },

    // ── Status ─────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
