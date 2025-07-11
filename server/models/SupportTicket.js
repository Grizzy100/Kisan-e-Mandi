import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String, // Cloudinary URL of the uploaded image
    },
    cropType: {
      type: String,
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    negotiatedPrice: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String, // Firebase UID
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
