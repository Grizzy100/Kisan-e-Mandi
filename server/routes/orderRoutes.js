import express from "express";
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",           protect, createOrder);         // customer places order
router.get("/my",          protect, getMyOrders);         // customer: my purchases
router.get("/vendor",      protect, getVendorOrders);     // farmer: incoming sales
router.get("/stats",       protect, getOrderStats);       // farmer: sales stats
router.patch("/:id/status", protect, updateOrderStatus);  // update order status

export default router;
