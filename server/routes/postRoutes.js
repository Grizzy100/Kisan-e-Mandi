import express from "express";
import { createPost, getAllPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", protect, createPost);

export default router;
