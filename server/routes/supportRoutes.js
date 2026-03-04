import express from "express";
import { createSupportTicket, getUserTickets } from "../controllers/supportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST   /api/support           → raise a support ticket
router.post("/", protect, createSupportTicket);

// GET    /api/support/my-tickets → get tickets for the logged-in user
router.get("/my-tickets", protect, getUserTickets);

export default router;
