import express from "express";
import { createSupportTicket } from "../controllers/supportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateSupportTicket } from "../middleware/validateRequest.js";

const router = express.Router();

// POST create a support ticket
router.post("/", protect, validateSupportTicket, createSupportTicket);

export default router;
