import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Pulses", "Spices", "Oilseeds", "Cereals", "Vegetables", "Fruits", "Other", "Wheat", "Rice"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    minOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "rejected"],
      default: "open",
    },
    // Tracks whether the confirmation email was delivered after ticket creation.
    // "pending" = not yet attempted, "sent" = delivered OK, "failed" = all retries exhausted
    confirmationEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
