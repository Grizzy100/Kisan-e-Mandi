// server/utils/emailUtils.js
// Centralized email utility:
//  - Single shared Nodemailer transporter (Gmail App Password)
//  - sendEmailWithRetry: retries up to MAX_RETRIES times with exponential backoff
//  - fireEmail: fire-and-forget wrapper — call after res.json() to never block the response

import nodemailer from "nodemailer";

// ── Single shared transporter (created once at server startup) ──────────────
console.log("[Email] Transporter init — EMAIL_USER:", process.env.EMAIL_USER ? "✅ SET" : "❌ NOT SET");
console.log("[Email] Transporter init — EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""), // strip any spaces from App Password
  },
});

// ── Retry configuration ─────────────────────────────────────────────────────
const MAX_RETRIES = 3;          // Total attempts
const BASE_DELAY_MS = 2000;     // 2s → 4s → 8s (exponential backoff)

/**
 * Sends an email with automatic retry on failure.
 * Uses exponential backoff between attempts.
 *
 * @param {object} mailOptions - Standard nodemailer mail options { to, subject, html }
 * @param {number} attempt     - Current attempt number (internal use, starts at 1)
 * @returns {Promise<boolean>} - true if email sent OK, false if all retries exhausted
 */
export async function sendEmailWithRetry(mailOptions, attempt = 1) {
  console.log(`[Email] 🔄 Attempt ${attempt}/${MAX_RETRIES} — to: ${mailOptions.to}, subject: "${mailOptions.subject}"`);
  try {
    const result = await transporter.sendMail({
      from: `"Kisan e-Mandi" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    });
    console.log(`[Email] Sent OK (attempt ${attempt}) — messageId: ${result.messageId}`);
    return true;
  } catch (err) {
    console.error(`[Email] Attempt ${attempt} FAILED — ${err.code || ""} ${err.message}`);
    if (attempt < MAX_RETRIES) {
      const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
      console.warn(`[Email] Retrying in ${delayMs / 1000}s... (${MAX_RETRIES - attempt} left)`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return sendEmailWithRetry(mailOptions, attempt + 1);
    } else {
      console.error(`[Email] All ${MAX_RETRIES} attempts exhausted for "${mailOptions.subject}". Giving up.`);
      return false;
    }
  }
}

/**
 * Fire-and-forget email dispatcher.
 * Call this AFTER res.json() has been sent so the HTTP response is never blocked.
 *
 * Usage:
 *   res.status(201).json({ ticket });                    // ← respond to user first
 *   fireEmail({ to, subject, html }, () => flagInDB());  // ← email sends in background
 *
 * @param {object}   mailOptions - { to, subject, html }
 * @param {function} [onFailure] - Optional callback that runs if all retries fail
 * @param {function} [onSuccess] - Optional callback that runs if email sends OK
 */
export function fireEmail(mailOptions, { onFailure, onSuccess } = {}) {
  // Intentionally not awaited — runs entirely in background
  sendEmailWithRetry(mailOptions)
    .then((sent) => {
      if (sent && onSuccess) onSuccess();
      if (!sent && onFailure) onFailure();
    })
    .catch((err) => {
      console.error("[Email] Unhandled background email error:", err.message);
      if (onFailure) onFailure();
    });
}
