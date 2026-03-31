import express from "express";
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderStats,
  adminGetAllOrders,
  adminUpdateOrderStatus
} from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// Customer/Farmer endpoints
router.post("/",           protect, createOrder);         // customer places order
router.get("/my",          protect, getMyOrders);         // customer: my purchases
router.get("/vendor",      protect, getVendorOrders);     // farmer: incoming sales
router.get("/stats",       protect, getOrderStats);       // farmer: sales stats
router.patch("/:id/status", protect, updateOrderStatus);  // update order status

// Admin endpoints
router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAllOrders); // admin: all orders overview
router.patch("/admin/:id/status", protect, authorizeRoles("admin"), adminUpdateOrderStatus); // admin: intervene order status

export default router;
