import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// @desc    Get earnings analytics
// @route   GET /api/analytics/earnings
// @access  Private (Farmer/Admin)
router.get("/earnings", protect, async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { range } = req.query; // '7d', '30d', '3m'

    let startDate = new Date();
    if (range === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (range === '3m') startDate.setMonth(startDate.getMonth() - 3);
    else startDate.setDate(startDate.getDate() - 7); // Default to 7d

    const orders = await Order.find({
      sellerId,
      status: { $in: ["confirmed", "shipped", "delivered"] },
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Format data for Recharts
    const chartData = [];
    const dateMap = {};

    // Initialize all dates in range to 0 to avoid gaps
    let current = new Date(startDate);
    const end = new Date();
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
      current.setDate(current.getDate() + 1);
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += order.totalPrice;
      }
    });

    for (const [date, amount] of Object.entries(dateMap)) {
      chartData.push({ date, earnings: amount });
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @desc    Get spending analytics for customers
// @route   GET /api/analytics/spending
// @access  Private (Customer)
router.get("/spending", protect, async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { range } = req.query;

    let startDate = new Date();
    if (range === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (range === '3m') startDate.setMonth(startDate.getMonth() - 3);

    const orders = await Order.find({
      userId: buyerId,
      status: { $nin: ["cancelled"] },
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    const dateMap = {};
    let current = new Date(startDate);
    const end = new Date();
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
      current.setDate(current.getDate() + 1);
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += order.totalPrice;
      }
    });

    const chartData = Object.entries(dateMap).map(([date, amount]) => ({
      date,
      spending: amount
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
