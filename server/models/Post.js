import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true, // Firebase UID
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
