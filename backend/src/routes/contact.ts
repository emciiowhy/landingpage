// backend/src/routes/contact.ts
import { Router, Request, Response } from "express";
import { db } from "../db";
import { contactMessages, ContactMessage } from "../db/schema";
import nodemailer from "nodemailer";

const router = Router();

// ✅ Gmail transporter
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_PASS = process.env.GMAIL_PASS || "";
const ADMIN_EMAIL = process.env.EMAIL_TO || "mcmcyap07@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// ✅ POST /api/contact - Save to DB + send emails
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

    // ✅ 1. Insert into DB (Drizzle ORM type-safe)
    const newMessage: ContactMessage = {
      firstName: name.split(" ")[0] || name,
      lastName: name.split(" ").slice(1).join(" ") || "",
      email,
      message,
    };

    const savedData = await db
      .insert(contactMessages)
      .values(newMessage)
      .returning();

    console.log("✅ Message saved to DB:", savedData[0]);

    // ✅ 2. Send emails async (won’t block response)
    sendEmailsAsync(name, email, message).catch((err) =>
      console.error("❌ Email sending failed:", err)
    );

    // ✅ Response sent immediately
    res.status(200).json({
      success: true,
      message: "✅ Message received and auto-reply sent!",
      data: savedData[0], // contains: id, firstName, lastName, email, message, createdAt
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
    await transporter.sendMail({
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
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
    await transporter.sendMail({
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
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
