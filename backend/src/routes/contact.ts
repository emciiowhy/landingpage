import { Router, Request, Response } from "express";
import { db } from "../db";
import nodemailer from "nodemailer";
import { contactMessages } from "../db/schema";

const router = Router();

const ADMIN_EMAIL = process.env.EMAIL_TO || "mcmcyap07@gmail.com";
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || "";

// ✅ Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'mcmcyap07@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ✅ POST /api/contact - Save to DB, send to Make.com, and send emails
router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const fullName = `${firstName} ${lastName}`;
    console.log("📨 Contact form received:", { firstName, lastName, email, company });

    // ✅ Save message into DB
    const saved = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    console.log("✅ Message saved:", saved[0]);

    // ✅ Send to Make.com webhook for AI lead qualification
    if (MAKE_WEBHOOK_URL) {
      sendToMakeWebhook({
        name: fullName,
        firstName,
        lastName,
        email,
        phone: phone || '',
        company: company || '',
        message,
        source: 'website-contact-form',
        timestamp: new Date().toISOString(),
      }).catch((err) => console.error("❌ Make.com webhook failed:", err));
    }

    // ✅ Send emails in background
    sendEmailsAsync(fullName, email, message).catch(console.error);

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

// ✅ Send data to Make.com webhook
async function sendToMakeWebhook(data: {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  source: string;
  timestamp: string;
}) {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    console.log('✅ Data sent to Make.com successfully');
  } catch (error) {
    console.error('❌ Failed to send to Make.com:', error);
    throw error;
  }
}

// ✅ Background task to handle email delivery via Gmail
async function sendEmailsAsync(name: string, email: string, message: string) {
  console.log('🔧 Starting email sending process...');
  console.log('📧 Sending to:', email);
  
  try {
    // Admin notification
    console.log('📤 Attempting to send admin notification...');
    await transporter.sendMail({
      from: '"Portfolio Contact" <mcmcyap07@gmail.com>',
      to: ADMIN_EMAIL,
      subject: `📨 New message from ${name}`,
      html: `
        <h3>New Portfolio Message 📩</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });
    console.log(`✅ Admin notified at ${ADMIN_EMAIL}`);

    // Auto-reply to user
    console.log('📤 Attempting to send auto-reply to visitor...');
    await transporter.sendMail({
      from: '"Mc Zaldy" <mcmcyap07@gmail.com>',
      to: email,
      subject: `Thanks for reaching out, ${name.split(" ")[0]}!`,
      html: `
        <p>Hi <strong>${name.split(" ")[0]}</strong>,</p>
        <p>Thanks for your message — I've received it and will get back to you soon!</p>
        <p>Regards,<br><strong>Mc Zaldy</strong></p>
      `,
    });
    console.log(`✅ Auto-reply sent to ${email}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}

export default router;
