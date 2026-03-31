import SupportTicket from "../models/SupportTicket.js";
import Item from "../models/Item.js";
import nodemailer from "nodemailer";
import {
  ITEM_STATUS,
  TICKET_STATUS,
  canTransitionItem,
  canTransitionTicket,
  getItemStateForTicketStatus,
  isValidTicketStatus,
} from "../utils/itemStateMachine.js";

// ── Helper: Nodemailer transporter ──────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── POST /api/support  (protected) ──────────────────────────────
export const createSupportTicket = async (req, res) => {
  try {
    const { category, subject, description, price, mediaUrl, mediaType } = req.body;

    const email = req.user?.email;
    const userId = req.user?._id;

    if (!email) {
      return res.status(401).json({ message: "Not authorized – no user email found." });
    }

    if (!category || !subject || !description || price === undefined) {
      return res.status(400).json({ message: "Category, subject, description, and price are required." });
    }

    // Save ticket
    const ticket = await SupportTicket.create({
      userId,
      email,
      category,
      subject,
      description,
      price: Number(price),
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "image",
    });

    // Map Category to CropType for Item schema
    const mapCategoryToCropType = (cat) => {
      const c = cat.toLowerCase();
      if (c === "wheat" || c === "rice") return "grain";
      if (c === "vegetables") return "vegetable";
      if (c === "fruits") return "fruit";
      return "other";
    };

    // Auto-generate a pending_admin Item from ticket fields
    await Item.create({
      ticketId: ticket._id,
      sellerId: userId,
      name: subject,
      description,
      cropType: mapCategoryToCropType(category),
      ticketCategory: category,   // preserve original label e.g. "Rice"
      cropName: subject,
      price: Number(price),
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "image",
      status: "pending_admin",
      isActive: false,
    });

    // Send confirmation email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Kisan e-Mandi Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🌱 Crop Negotiation Request Received: ${category}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <div style="background:#16a34a;padding:20px 24px;">
              <h1 style="color:white;margin:0;font-size:18px;">Kisan e-Mandi - Crop Enlistment</h1>
            </div>
            <div style="padding:24px;">
              <p style="color:#374151;margin-top:0;">Dear Farmer,</p>
              <p style="color:#374151;">Your request to enlist a crop for negotiation has been successfully received. Our admin team will review your submission.</p>
              <p style="color:#374151;font-weight:bold;">Upon approval, you will be able to enlist it on the marketplace.</p>
              
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
                <p style="margin:0 0 8px;color:#166534;font-weight:600;">Request Details</p>
                <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Ticket ID:</strong> ${ticket._id}</p>
                <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Crop Category:</strong> ${category}</p>
                <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Requested Price:</strong> ₹${price}</p>
              </div>
              
              <p style="color:#6b7280;font-size:13px;">You can track this request in the <strong>My Activity</strong> section of your dashboard.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
              <p style="color:#9ca3af;font-size:12px;margin:0;">Kisan e-Mandi Team</p>
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      // Log email failure but don't block the ticket creation response
      console.error("Email send failed (ticket still created):", mailErr.message);
    }

    return res.status(201).json({
      message: "Ticket raised successfully. A confirmation has been sent to your email.",
      ticket,
    });
  } catch (err) {
    console.error("❌ Error creating support ticket:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/support/my-tickets  (protected) ─────────────────────
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ tickets });
  } catch (err) {
    console.error("❌ Error fetching tickets:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── PATCH /api/support/:id/status (Admin) ───────────────────────
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. "resolved" (for approve), "rejected"

    if (!status || !isValidTicketStatus(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: open, in-progress, resolved, rejected.",
      });
    }

    const ticket = await SupportTicket.findById(id).populate("userId");
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    if (!canTransitionTicket(ticket.status, status)) {
      return res.status(409).json({
        message: `Ticket cannot move from '${ticket.status}' to '${status}'.`,
      });
    }

    if (ticket.status !== status) {
      ticket.status = status;
      await ticket.save();
    }

    // Find the drafted item and update its status too.
    console.log(`🔍 [updateTicketStatus] Looking for item with ticketId: ${id}`);
    const item = await Item.findOne({ ticketId: id });
    console.log(`🔍 [updateTicketStatus] Item found:`, item ? `${item._id} (status: ${item.status})` : "NOT FOUND");
    let itemStatusField = ITEM_STATUS.PENDING_ADMIN;

    if (item) {
      const targetItemState = getItemStateForTicketStatus(status);
      itemStatusField = targetItemState.status;

      const isLegacyPublishedResolvedCase =
        item.status === ITEM_STATUS.PUBLISHED &&
        status === TICKET_STATUS.RESOLVED;

      if (isLegacyPublishedResolvedCase) {
        // Backward compatibility: keep already-live legacy listing live.
        itemStatusField = ITEM_STATUS.PUBLISHED;
        console.log(`ℹ️ [updateTicketStatus] Keeping legacy live item ${item._id} as published.`);
      } else if (!canTransitionItem(item.status, targetItemState.status)) {
        return res.status(409).json({
          message: `Item cannot move from '${item.status}' to '${targetItemState.status}'.`,
        });
      } else {
        item.status = targetItemState.status;
        item.isActive = targetItemState.isActive;
        if (targetItemState.status === ITEM_STATUS.APPROVED_HIDDEN) {
          console.log(`✅ [updateTicketStatus] Setting item ${item._id} to approved_hidden (awaiting farmer publish)`);
        } else if (targetItemState.status === ITEM_STATUS.REJECTED) {
          console.log(`❌ [updateTicketStatus] Setting item ${item._id} to rejected`);
        } else {
          console.log(`ℹ️ [updateTicketStatus] Keeping item ${item._id} as pending_admin during review`);
        }
      }

      const saved = await item.save();
      console.log(`💾 [updateTicketStatus] Item saved:`, saved.status, saved.isActive);
    } else {
      console.warn(`⚠️ [updateTicketStatus] No item found with ticketId ${id} — item won't be updated!`);
    }

    // Try sending email notification to the user
    try {
      if (ticket.email) {
        const transporter = createTransporter();
        const statLabel = status === TICKET_STATUS.RESOLVED ? "Approved" : "Rejected";

        await transporter.sendMail({
          from: `"Kisan e-Mandi Admin" <${process.env.EMAIL_USER}>`,
          to: ticket.email,
          subject: `Crop Enlistment Update: ${statLabel}`,
          html: `
            <div style="font-family:sans-serif;padding:20px;">
              <h2>Your request has been ${statLabel}</h2>
              <p>Your ticket for <strong>${ticket.subject}</strong> has been updated to <strong>${status}</strong> by our admins.</p>
              ${status === TICKET_STATUS.RESOLVED ? '<p>Your crop listing is <strong>approved</strong>. Please open <strong>My Listings</strong> and click <strong>Accept</strong> to publish it on the marketplace.</p>' : '<p>Sorry, your request was denied at this time.</p>'}
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.error("Failed sending admin status email:", mailErr);
    }

    return res.json({ message: `Ticket ${status} successfully`, ticket, itemStatus: itemStatusField });
  } catch (err) {
    console.error("❌ Error updating ticket status:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET /api/support/all  (admin only) ───────────────────────────
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.status(200).json(tickets);
  } catch (err) {
    console.error("getAllTickets error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
