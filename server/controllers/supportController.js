// import SupportTicket from "../models/SupportTicket.js";
// import nodemailer from "nodemailer";

// export const createSupportTicket = async (req, res) => {
//   try {
//     const {
//       cropType,
//       cropName,
//       negotiatedPrice,
//       description,
//       imageUrl,
//       location,
//     } = req.body;

//     // ✅ Use email from Firebase token (already verified)
//     const email = req.user.email;

//     if (!email || !cropType || !cropName || !description) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     const ticket = await SupportTicket.create({
//       cropType,
//       cropName,
//       negotiatedPrice,
//       description,
//       imageUrl,
//       userId: req.user.uid,
//     });

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Regarding Ticket",
//       text: "Greeting respected Farm Mate !!!",
//       html: `
//         <p>Your ticket has been raised.</p>
//         <p>This is your ID: <strong>${ticket._id}</strong></p>
//       `,
//     });

//     return res.status(201).json({
//       message: "Support ticket created and confirmation email sent.",
//       ticket,
//     });
//   } catch (err) {
//     console.error("❌ Error creating support ticket:", err);
//     res.status(500).json({ message: "Server error." });
//   }
// };


import SupportTicket from "../models/SupportTicket.js";
import nodemailer from "nodemailer";

export const createSupportTicket = async (req, res) => {
  try {
    const {
      cropType,
      cropName,
      negotiatedPrice,
      description,
      imageUrl,
      location,
    } = req.body;

    const email = req.user?.email;
    const userId = req.user?.uid;

    if (!email || !cropType || !cropName || !description) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Save ticket to MongoDB
    const ticket = await SupportTicket.create({
      cropType,
      cropName,
      negotiatedPrice,
      description,
      imageUrl,
      location,
      userId,
    });

    // ✅ Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // use TLS, not SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Send confirmation email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || '"Kisan e-Mandi" <no-reply@kisan.com>',
      to: email,
      subject: "🎫 Ticket Confirmation - Kisan e-Mandi",
      text: `Hello,\n\nYour support ticket has been raised.\nTicket ID: ${ticket._id}`,
      html: `
        <p>Dear user,</p>
        <p>Thank you for reaching out. Your support ticket has been successfully submitted.</p>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p>We’ll get back to you shortly.</p>
        <br/>
        <p>Regards,<br/>Kisan e-Mandi Team</p>
      `,
    });

    return res.status(201).json({
      message: "✅ Ticket created and confirmation email sent.",
      ticket,
    });
  } catch (err) {
    console.error("❌ Error creating support ticket:", err);

    // Provide clearer error details if Mongoose or email fails
    return res.status(500).json({
      message: "❌ Failed to create ticket or send email.",
      error: err.message || "Internal server error",
    });
  }
};

