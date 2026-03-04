import SupportTicket from "../models/SupportTicket.js";
import nodemailer from "nodemailer";

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
