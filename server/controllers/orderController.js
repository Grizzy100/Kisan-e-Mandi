import Order from "../models/Order.js";
import Item from "../models/Item.js";
import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

// ── POST /api/orders  (customer) ────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { itemId, quantity = 1, deliveryAddress, notes } = req.body;
    const customerId = req.user._id;

    if (!itemId || !deliveryAddress) {
      return res.status(400).json({ message: "itemId and deliveryAddress are required." });
    }

    const item = await Item.findById(itemId).populate("sellerId", "name email");
    if (!item || !item.isActive || item.status !== "published") {
      return res.status(404).json({ message: "Item not available for ordering." });
    }

    if (item.sellerId._id.toString() === customerId.toString()) {
      return res.status(400).json({ message: "You cannot order your own listing." });
    }

    const totalPrice = item.price * Number(quantity);

    const order = await Order.create({
      customerId,
      sellerId: item.sellerId._id,
      itemId: item._id,
      itemName: item.name,
      itemPrice: item.price,
      ticketCategory: item.ticketCategory || item.cropType,
      cropName: item.cropName,
      mediaUrl: item.mediaUrl || "",
      quantity: Number(quantity),
      totalPrice,
      deliveryAddress,
      notes: notes || "",
      paymentMethod: "cod",
    });

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
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Qty:</strong> ${quantity} ${item.unit}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Total:</strong> ₹${totalPrice.toLocaleString("en-IN")}</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Payment:</strong> Cash on Delivery</p>
                  <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Deliver to:</strong> ${deliveryAddress}</p>
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
      .populate("itemId", "name mediaUrl cropType");

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
      .populate("itemId", "name mediaUrl cropType ticketCategory")
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
      .populate("itemId", "name mediaUrl cropType ticketCategory")
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
    const allowed = ["confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const isSeller   = order.sellerId.toString()   === req.user._id.toString();
    const isBuyer    = order.customerId.toString() === req.user._id.toString();
    const isAdmin    = req.user.role === "admin";

    // Customers can only cancel
    if (isBuyer && status !== "cancelled") {
      return res.status(403).json({ message: "Customers can only cancel orders." });
    }
    if (!isSeller && !isBuyer && !isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    order.status = status;
    await order.save();
    return res.json({ message: `Order marked as ${status}.`, order });
  } catch (err) {
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
