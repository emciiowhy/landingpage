// backend/src/routes/contact.ts
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import nodemailer from 'nodemailer';

const router = Router();

// ✅ Setup Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // App Password from Google
  },
});

// ✅ Verify transporter connection (optional but helpful for debugging)
transporter.verify((error) => {
  if (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
  } else {
    console.log('✅ Gmail SMTP server is ready to send emails');
  }
});

// ✅ POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.',
      });
    }

    // ✅ Save message to database
    const result = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    console.log(`✅ Contact saved from ${email}`);

    // ✅ Send success response first
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: result[0],
    });

    // ✅ Send emails in background (don’t block user)
    const fullName = `${firstName} ${lastName}`;

    const baseStyle = `
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #ffffff;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: 16px;
      padding: 24px;
    `;

    const cardStyle = `
      background: rgba(255,255,255,0.08);
      padding: 16px;
      border-radius: 12px;
      margin-top: 12px;
      line-height: 1.6;
    `;

    // ✅ Email 1: Notify you
    const ownerMail = transporter.sendMail({
      from: `"Portfolio Alert" <${process.env.SMTP_USER}>`,
      to: 'mcmcyap07@gmail.com',
      subject: `📬 New Message from ${fullName}`,
      html: `
        <div style="${baseStyle}">
          <h2>🚀 New Contact Form Submission</h2>
          <div style="${cardStyle}">
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="border-left: 3px solid #60a5fa; padding-left: 10px;">${message}</blockquote>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">
            Sent from <a href="https://mczaldy.vercel.app" style="color:#60a5fa;">mczaldy.vercel.app</a>
          </p>
        </div>
      `,
    });

    // ✅ Email 2: Auto-reply to sender
    const autoReplyMail = transporter.sendMail({
      from: `"Mc Zaldy Yap" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thanks for reaching out! 💬',
      html: `
        <div style="${baseStyle}">
          <h2>Hey ${firstName},</h2>
          <p>Thank you for reaching out! I’ve received your message and will get back to you soon.</p>
          <p style="${cardStyle}">Your Message:<br/>${message}</p>
          <p>Meanwhile, feel free to check out my portfolio:</p>
          <a href="https://mczaldy.vercel.app" style="background:#60a5fa;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;display:inline-block;">Visit My Website</a>
          <br/><br/>
          <p style="color:#94a3b8;">– Mc Zaldy Yap<br/>Full Stack Developer & Automation Enthusiast</p>
        </div>
      `,
    });

    await Promise.allSettled([ownerMail, autoReplyMail]);
    console.log('✅ Emails sent successfully');

  } catch (error) {
    console.error('❌ Error in contact route:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again later.',
      });
    }
  }
});

// ✅ GET /api/contact - Fetch all messages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const messages = await db.select().from(contactMessages);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

export default router;
