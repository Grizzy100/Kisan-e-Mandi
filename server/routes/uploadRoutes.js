import express from "express";
import { getUploadSignature } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/upload/sign — get signed upload credentials
router.get("/sign", protect, getUploadSignature);

export default router;
