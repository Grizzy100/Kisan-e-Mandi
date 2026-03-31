import mongoose from "mongoose";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

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
      enum: ORDER_STATUSES,
      default: "pending",
    },

    statusHistory: [
      {
        from: {
          type: String,
          enum: ORDER_STATUSES,
        },
        to: {
          type: String,
          enum: ORDER_STATUSES,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        changedByRole: {
          type: String,
          enum: ["customer", "farmer", "admin", "system"],
          default: "system",
        },
        note: {
          type: String,
          trim: true,
          maxlength: 250,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    paymentMethod: { type: String, default: "cod" }, // Cash on Delivery — no gateway yet
    deliveryAddress: { type: String, required: true },
    notes:         { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
