import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // ── Author ─────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Content ────────────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, trim: true },

    // ── Media (image or video) ─────────────────────────────────
    mediaUrl: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    imageUrl: { type: String }, // legacy

    // ── Crop metadata (for item-listing flow) ──────────────────
    cropType: { type: String, trim: true },
    cropName: { type: String, trim: true },
    price: { type: Number },

    // ── Admin approval ─────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },

    // ── Social ─────────────────────────────────────────────────
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", postSchema);
