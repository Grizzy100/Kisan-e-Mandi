import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "kisan-e-mandi-posts",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? ["mp4", "webm", "mov", "avi"]
        : ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: isVideo
        ? [{ quality: "auto", fetch_format: "mp4" }]
        : [{ width: 1200, height: 900, crop: "limit", quality: "auto" }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

export default upload;
