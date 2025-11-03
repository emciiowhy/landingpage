// backend/src/routes/contact.ts
import { Router, Request, Response } from "express";
import { db } from "../db";
import { Resend } from "resend";
import { contactMessages } from "../db/schema";

const router = Router();

const resend = new Resend(process.env.RESEND_API_KEY || "");
const ADMIN_EMAIL = process.env.EMAIL_TO || "mcmcyap07@gmail.com";

// ✅ POST /api/contact - Save to DB and send emails
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    console.log("📨 Contact form received:", { name, email });

    // ✅ 1. Insert message into Neon DB (with Drizzle ORM)
    const savedData = await db
      .insert(contactMessages)
      .values({
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        email,
        message,
      })
      .returning();

    console.log("✅ Message saved to DB:", savedData[0]);

    // ✅ 2. Send emails (non-blocking)
    sendEmailsAsync(name, email, message).catch((error) =>
      console.error("❌ Email send operation failed:", error)
    );

    // ✅ Respond instantly - email will happen in background
    res.status(200).json({
      success: true,
      message: "✅ Message received and auto-reply sent!",
      data: savedData[0],
    });
  } catch (error) {
    console.error("❌ Error in /api/contact:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process message.",
    });
  }
});

async function sendEmailsAsync(name: string, email: string, message: string) {
  try {
    // ✅ Admin notification
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `📨 New portfolio message from ${name}`,
      html: `
        <h2>New Message from Portfolio Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log(`📧 Admin email sent to: ${ADMIN_EMAIL}`);

    // ✅ Auto-reply to sender
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: email,
      subject: "📩 Thanks for contacting me!",
      html: `
        <p>Hi ${name.split(" ")[0]},</p>
        <p>Thank you for reaching out! I’ve received your message and will get back to you soon.</p>
        <p>Best regards,<br><strong>Mc Zaldy</strong></p>
      `,
    });

    console.log(`📧 Auto-reply sent to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

export default router;
