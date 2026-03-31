import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary using a native Node.js Readable stream.
 * 
 * @param {Buffer} buffer - The file buffer from multer (req.file.buffer)
 * @param {string} mimetype - The file type (e.g., 'image/png' or 'video/mp4')
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, mimetype, options = {}) => {
  const isVideo = mimetype?.startsWith("video/");
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "kisan-e-mandi-posts", // Preserving original folder name
        resource_type: isVideo ? "video" : "image",
        allowed_formats: isVideo
          ? ["mp4", "webm", "mov", "avi"]
          : ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: isVideo
          ? [{ quality: "auto", fetch_format: "mp4" }]
          : [{ width: 1200, height: 900, crop: "limit", quality: "auto" }],
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert Buffer to Stream and pipe to Cloudinary
    Readable.from(buffer).pipe(uploadStream);
  });
};
