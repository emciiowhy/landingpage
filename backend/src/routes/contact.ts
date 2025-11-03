import { Router, Request, Response } from "express";
import { db } from "../db";
import { Resend } from "resend";
import { contactMessages } from "../db/schema";

const router = Router();

// ✅ Initialize Resend once
const resend = new Resend(process.env.RESEND_API_KEY || "");
const ADMIN_EMAIL = process.env.EMAIL_TO || "mcmcyap07@gmail.com";

// ✅ POST /api/contact - Save to DB and send emails
router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    console.log("📨 Contact form received:", { firstName, lastName, email });

    // ✅ Save message into DB
    const saved = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    console.log("✅ Message saved:", saved[0]);

    // ✅ Send emails in background
    sendEmailsAsync(`${firstName} ${lastName}`, email, message).catch(console.error);

    res.status(200).json({
      success: true,
      message: "Your message has been sent and recorded.",
      data: saved[0],
    });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong while submitting.",
    });
  }
});

// ✅ Background task to handle email delivery
async function sendEmailsAsync(name: string, email: string, message: string) {
  try {
    // Admin notification
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `📨 New message from ${name}`,
      html: `
        <h3>New Portfolio Message 📩</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });
    console.log(`📧 Admin notified.`);

    // Auto-reply to user
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: email,
      subject: `Thanks for reaching out, ${name.split(" ")[0]}!`,
      html: `
        <p>Hi <strong>${name.split(" ")[0]}</strong>,</p>
        <p>Thanks for your message — I’ve received it and will get back to you soon!</p>
        <p>Regards,<br><strong>Mc Zaldy</strong></p>
      `,
    });
    console.log(`📧 Auto-reply sent to visitor.`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}

export default router;
