// ── GET /api/orders/admin/all  (admin — all orders overview) ─────────────
export const adminGetAllOrders = async (req, res) => {
  try {
    // Optional filters: status, customerId, sellerId, date range
    const { status, customerId, sellerId, from, to } = req.query;
    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (sellerId) query.sellerId = sellerId;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const orders = await Order.find(query)
      .populate("customerId", "name email avatar")
      .populate("sellerId", "name email avatar")
      .populate("itemId", "name mediaUrl cropType ticketCategory unit")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};



import Order from "../models/Order.js";
import Item from "../models/Item.js";
import nodemailer from "nodemailer";
import { ITEM_STATUS } from "../utils/itemStateMachine.js";
import {
  ORDER_STATUS,
  isValidOrderStatus,
  checkOrderTransition,
  assertOrderTransition,
} from "../utils/orderStateMachine.js";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

// ── PATCH /api/orders/admin/:id/status  (admin — intervene order status) ──
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!isValidOrderStatus(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.status === status) {
      return res.status(200).json({ message: `Order is already marked as ${status}.`, order });
    }
    // Use guard utility for transition and permissions
    try {
      assertOrderTransition({
        currentStatus: order.status,
        nextStatus: status,
        actorRole: req.user.role,
        isAdmin: req.user.role === "admin",
        isBuyer: order.customerId.toString() === req.user._id.toString(),
        isSeller: order.sellerId.toString() === req.user._id.toString(),
      });
    } catch (err) {
      return res.status(err.statusCode || 403).json({ message: err.message });
    }
    // Admin can always update, but log the intervention
    const previousStatus = order.status;
    order.status = status;
    if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
    order.statusHistory.push({
      from: previousStatus,
      to: status,
      changedBy: req.user._id,
      changedByRole: "admin",
      note: note ? String(note).slice(0,250) : "Admin intervention",
    });
    await order.save();

    // Notify buyer by email on status change
    try {
      const transporter = createTransporter();
      const buyer = await Order.findById(order._id).populate("customerId", "name email");
      const buyerEmail = buyer.customerId?.email;
      if (buyerEmail) {
        await transporter.sendMail({
          from: `"Kisan e-Mandi Orders" <${process.env.EMAIL_USER}>`,
          to: buyerEmail,
          subject: `Order Update: Your order is now '${status}'`,
          html: `
            <div style=\"font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;\">
              <div style=\"background:#2563eb;padding:20px 24px;\">
                <h1 style=\"color:white;margin:0;font-size:18px;\">Order Status Update</h1>
              </div>
              <div style=\"padding:24px;\">
                <p style=\"color:#374151;\">Your order <strong>${order._id}</strong> status has changed to <strong>${status}</strong>.</p>
                <div style=\"background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:16px;margin:16px 0;\">
                  <p style=\"margin:4px 0;font-size:14px;color:#374151;\"><strong>Order ID:</strong> ${order._id}</p>
                  <p style=\"margin:4px 0;font-size:14px;color:#374151;\"><strong>Current Status:</strong> ${status}</p>
                  <p style=\"margin:4px 0;font-size:14px;color:#374151;\"><strong>Updated At:</strong> ${new Date().toLocaleString("en-IN")}</p>
                </div>
                <p style=\"color:#6b7280;font-size:13px;\">Log into your dashboard for more details.</p>
              </div>
            </div>`
        });
      }
    } catch (mailErr) {
      console.error("Order status notification email to buyer failed:", mailErr.message);
    }

    return res.json({ message: `Order forcibly marked as ${status} by admin.`, order });
  } catch (err) {
    console.error("adminUpdateOrderStatus error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── POST /api/orders  (customer) ────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { itemId, quantity = 1, deliveryAddress, notes } = req.body;
    const customerId = req.user._id;
    const customerRole = req.user.role || "customer";

    if (!itemId || !deliveryAddress) {
      return res.status(400).json({ message: "itemId and deliveryAddress are required." });
    }

    if (customerRole !== "customer") {
      return res.status(403).json({ message: "Only customers can place orders." });
    }

    const quantityNumber = Number(quantity);
    if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
      return res.status(400).json({ message: "Quantity must be a whole number greater than 0." });
    }

    const normalizedAddress = String(deliveryAddress || "").trim();
    if (!normalizedAddress) {
      return res.status(400).json({ message: "Delivery address cannot be empty." });
    }

    const item = await Item.findById(itemId).populate("sellerId", "name email");
    if (!item || !item.isActive || item.status !== ITEM_STATUS.PUBLISHED) {
      return res.status(404).json({ message: "Item not available for ordering." });
    }

    if (item.sellerId._id.toString() === customerId.toString()) {
      return res.status(400).json({ message: "You cannot order your own listing." });
    }

    if (!Number.isFinite(item.price) || item.price < 0) {
      return res.status(400).json({ message: "Item has invalid pricing data." });
    }

    if (!Number.isFinite(item.quantity) || item.quantity < quantityNumber) {
      return res.status(409).json({ message: "Requested quantity is not available." });
    }

    const reservedItem = await Item.findOneAndUpdate(
      {
        _id: itemId,
        status: ITEM_STATUS.PUBLISHED,
        isActive: true,
        quantity: { $gte: quantityNumber },
      },
      { $inc: { quantity: -quantityNumber } },
      { new: true }
    ).populate("sellerId", "name email");

    if (!reservedItem) {
      return res.status(409).json({
        message: "Listing is no longer available in the requested quantity.",
      });
    }

    if (reservedItem.quantity === 0) {
      reservedItem.status = ITEM_STATUS.SHELVED;
      reservedItem.isActive = false;
      await reservedItem.save();
    }

    const totalPrice = item.price * quantityNumber;

    let order;
    try {
      order = await Order.create({
        customerId,
        sellerId: item.sellerId._id,
        itemId: item._id,
        itemName: item.name,
        itemPrice: item.price,
        ticketCategory: item.ticketCategory || item.cropType,
        cropName: item.cropName,
        mediaUrl: item.mediaUrl || "",
        quantity: quantityNumber,
        totalPrice,
        deliveryAddress: normalizedAddress,
        notes: notes || "",
        paymentMethod: "cod",
        status: ORDER_STATUS.PENDING,
        statusHistory: [
          {
            to: ORDER_STATUS.PENDING,
            changedBy: customerId,
            changedByRole: "customer",
            note: "Order placed",
          },
        ],
      });
    } catch (createError) {
      // Best-effort rollback of reserved quantity if order creation fails.
      await Item.updateOne({ _id: itemId }, { $inc: { quantity: quantityNumber } });
      if (reservedItem.quantity === 0) {
        await Item.updateOne(
          { _id: itemId, status: ITEM_STATUS.SHELVED, isActive: false },
          { $set: { status: ITEM_STATUS.PUBLISHED, isActive: true } }
        );
      }
      throw createError;
    }

    // Notify vendor by email
    try {
      const transporter = createTransporter();
      const vendorEmail = item.sellerId.email;
      if (vendorEmail) {
        await transporter.sendMail({
          from: `"Kisan e-Mandi Orders" <${process.env.EMAIL_USER}>`,
          to: vendorEmail,
          subject: `🛒 New Order for "${item.name}"`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <div style="background:#16a34a;padding:20px 24px;">
                <h1 style="color:white;margin:0;font-size:18px;">New Order Received!</h1>
              </div>
              <div style="padding:24px;">
                <p style="color:#374151;">You have a new order for <strong>${item.name}</strong>.</p>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Qty:</strong> ${quantityNumber} ${item.unit}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Total:</strong> ₹${totalPrice.toLocaleString("en-IN")}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Payment:</strong> Cash on Delivery</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Deliver to:</strong> ${normalizedAddress}</p>
                  ${notes ? `<p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Notes:</strong> ${notes}</p>` : ""}
                </div>
                <p style="color:#6b7280;font-size:13px;">Log into your dashboard to confirm and manage this order.</p>
              </div>
            </div>`,
        });
      }
    } catch (mailErr) {
      console.error("Order notification email failed:", mailErr.message);
    }

    const populated = await Order.findById(order._id)
      .populate("customerId", "name email avatar")
      .populate("sellerId", "name email")
      .populate("itemId", "name mediaUrl cropType ticketCategory unit");

    return res.status(201).json({ message: "Order placed successfully! 🎉", order: populated });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/orders/my  (customer — their purchases) ────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("sellerId", "name email avatar")
      .populate("itemId", "name mediaUrl cropType ticketCategory unit")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET /api/orders/vendor  (farmer — their sales) ──────────────
export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id })
      .populate("customerId", "name email avatar")
      .populate("itemId", "name mediaUrl cropType ticketCategory unit")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// ── PATCH /api/orders/:id/status  (farmer or customer) ──────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!isValidOrderStatus(status) || status === ORDER_STATUS.PENDING) {
      return res.status(400).json({
        message: "Status must be one of: confirmed, shipped, delivered, cancelled.",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const isSeller   = order.sellerId.toString()   === req.user._id.toString();
    const isBuyer    = order.customerId.toString() === req.user._id.toString();
    const isAdmin    = req.user.role === "admin";

    if (!isSeller && !isBuyer && !isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (order.status === status) {
      return res.status(200).json({
        message: `Order is already marked as ${status}.`,
        order,
      });
    }

    // Use guard utility for transition and permissions
    try {
      assertOrderTransition({
        currentStatus: order.status,
        nextStatus: status,
        actorRole: req.user.role,
        isAdmin,
        isBuyer,
        isSeller,
      });
    } catch (err) {
      return res.status(err.statusCode || 403).json({ message: err.message });
    }

    // Atomic inventory rollback on cancel
    if (status === ORDER_STATUS.CANCELLED) {
      // TODO: For full atomicity, wrap in a MongoDB transaction if supported
      await Item.updateOne(
        { _id: order.itemId },
        { $inc: { quantity: Number(order.quantity) || 0 } }
      );
      // Optionally: If item was previously sold out, consider republishing if stock is now available
    }

    const previousStatus = order.status;
    order.status = status;

    if (!Array.isArray(order.statusHistory)) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      from: previousStatus,
      to: status,
      changedBy: req.user._id,
      changedByRole: req.user.role || "system",
      note: `Status updated by ${req.user.role || "system"}`,
    });

    await order.save();

    // Notify buyer by email on status change
    try {
      const transporter = createTransporter();
      const buyer = await Order.findById(order._id).populate("customerId", "name email");
      const buyerEmail = buyer.customerId?.email;
      if (buyerEmail) {
        await transporter.sendMail({
          from: `"Kisan e-Mandi Orders" <${process.env.EMAIL_USER}>`,
          to: buyerEmail,
          subject: `Order Update: Your order is now '${status}'`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <div style="background:#2563eb;padding:20px 24px;">
                <h1 style="color:white;margin:0;font-size:18px;">Order Status Update</h1>
              </div>
              <div style="padding:24px;">
                <p style="color:#374151;">Your order <strong>${order._id}</strong> status has changed to <strong>${status}</strong>.</p>
                <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:16px;margin:16px 0;">
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Current Status:</strong> ${status}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Updated At:</strong> ${new Date().toLocaleString("en-IN")}</p>
                </div>
                <p style="color:#6b7280;font-size:13px;">Log into your dashboard for more details.</p>
              </div>
            </div>`
        });
      }
    } catch (mailErr) {
      console.error("Order status notification email to buyer failed:", mailErr.message);
    }

    return res.json({ message: `Order marked as ${status}.`, order });

  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET /api/orders/stats  (farmer — sales summary) ─────────────
export const getOrderStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ sellerId, status: { $ne: "cancelled" } });
    const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
    const delivered    = orders.filter((o) => o.status === "delivered").length;
    const pending      = orders.filter((o) => o.status === "pending").length;
    return res.json({ totalRevenue, totalOrders: orders.length, delivered, pending });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};
