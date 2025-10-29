// backend/src/routes/contact.ts
// ✅ Handles contact form submissions, saves to Neon via Drizzle ORM, and sends Gmail notifications

import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { db } from '../db/index'; // ensure correct import path
import { contactMessages } from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// ✅ Gmail transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL for Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ POST /api/contact - Store message + send email
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // --- Basic validation ---
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

    // --- Insert message into Neon (Drizzle ORM) ---
    const result = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    console.log(`✅ Contact saved for ${email}`);

    // --- Email notification ---
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER || process.env.EMAIL_USER, // Fallback to your email
      subject: `📬 New message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4f46e5;">New Portfolio Message</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 6px;">${message}</p>
            <hr>
            <p style="font-size: 12px; color: gray;">This message was automatically sent from your portfolio contact form.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('📨 Email notification sent successfully.');

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully and email delivered!',
      data: result[0],
    });
  } catch (error: any) {
    console.error('❌ Error saving or emailing contact message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message. Please try again later.',
      details: error.message,
    });
  }
});

// ✅ GET /api/contact - Fetch all stored messages
router.get('/', async (req: Request, res: Response) => {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages.',
    });
  }
});

export default router;
