import { Router, Request, Response } from "express";
import { db } from "../db";
import nodemailer from "nodemailer";
import { contactMessages } from "../db/schema";

const router = Router();

const ADMIN_EMAIL = process.env.EMAIL_TO || "mcmcyap07@gmail.com";

// ✅ Create Gmail transporter with timeout
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.GMAIL_USER || 'mcmcyap07@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'kncoorrokjochxuc',
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Verify connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
  } else {
    console.log('✅ Gmail SMTP server is ready to send emails');
  }
});

// ✅ POST /api/contact - Save to DB and send emails
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

// ✅ Background task to handle email delivery via Gmail
async function sendEmailsAsync(name: string, email: string, message: string) {
  console.log('🔧 Starting email sending process...');
  console.log('📧 Gmail User:', process.env.GMAIL_USER);
  console.log('🔑 Gmail Password exists:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('📧 Sending to:', email);
  
  try {
    // Admin notification
    console.log('📤 Attempting to send admin notification...');
    const adminInfo = await transporter.sendMail({
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
    console.log(`✅ Admin notified at ${ADMIN_EMAIL}`, adminInfo.messageId);

    // Auto-reply to user
    console.log('📤 Attempting to send auto-reply to visitor...');
    const replyInfo = await transporter.sendMail({
      from: '"Mc Zaldy" <mcmcyap07@gmail.com>',
      to: email,
      subject: `Thanks for reaching out, ${name.split(" ")[0]}!`,
      html: `
        <p>Hi <strong>${name.split(" ")[0]}</strong>,</p>
        <p>Thanks for your message — I've received it and will get back to you soon!</p>
        <p>Regards,<br><strong>Mc Zaldy</strong></p>
      `,
    });
    console.log(`✅ Auto-reply sent to ${email}`, replyInfo.messageId);
  } catch (err: any) {
    console.error("❌ Email sending failed:", err.message);
    console.error("❌ Full error:", err);
  }
}

export default router;