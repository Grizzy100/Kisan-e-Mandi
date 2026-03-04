// controllers/uploadController.js
import cloudinary from "../config/cloudinary.js";

/**
 * POST /api/upload/sign
 * Returns a Cloudinary signed upload signature so the frontend can
 * upload directly to Cloudinary without exposing the API secret.
 */
export const getUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round(Date.now() / 1000);
        const folder = "kisan-emandi/posts";

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder,
        });
    } catch (err) {
        console.error("Cloudinary sign error:", err);
        res.status(500).json({ message: "Could not generate upload signature." });
    }
};
