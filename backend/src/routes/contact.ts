// backend/src/routes/contact.ts
// API route for handling contact form submissions with Gmail SMTP (Nodemailer)

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

// ✅ POST /api/contact - Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // ✅ Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // ✅ Save message to database
    const result = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    console.log(`✅ Contact saved from ${email}`);

    // ✅ Respond immediately (no delay)
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: result[0],
    });

    // ✅ Send emails asynchronously
    const fullName = `${firstName} ${lastName}`;

    // Common HTML style
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

    // ✅ 1. Send notification email to YOU
    await transporter.sendMail({
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

    // ✅ 2. Auto-reply to sender
    await transporter.sendMail({
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

  } catch (error) {
    console.error('❌ Error saving or emailing contact message:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again later.',
      });
    }
  }
});

// ✅ GET /api/contact - Fetch all contact messages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

export default router;
