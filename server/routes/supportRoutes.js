import express from "express";
import { createSupportTicket, getUserTickets, updateTicketStatus, getAllTickets } from "../controllers/supportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST   /api/support           → raise a support ticket
router.post("/", protect, createSupportTicket);

// GET    /api/support/my-tickets → get tickets for the logged-in user
router.get("/my-tickets", protect, getUserTickets);

// GET    /api/support/all → admin: get all tickets
router.get("/all", protect, authorizeRoles("admin"), getAllTickets);

// PATCH  /api/support/:id/status → admin approve/reject
router.patch("/:id/status", protect, authorizeRoles("admin"), updateTicketStatus);

export default router;
