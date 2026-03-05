import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    // Snapshot of item at order time
    itemName:     { type: String, required: true },
    itemPrice:    { type: Number, required: true },
    ticketCategory: { type: String },
    cropName:     { type: String },
    mediaUrl:     { type: String },

    quantity:     { type: Number, default: 1, min: 1 },
    totalPrice:   { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: { type: String, default: "cod" }, // Cash on Delivery — no gateway yet
    deliveryAddress: { type: String, required: true },
    notes:         { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
