// backend/src/routes/contact.ts
// API route for handling contact form submissions + Gmail notifications

import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// Gmail transporter setup (reliable SMTP config)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact - Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Insert into database
    const result = await db.insert(contactMessages).values({
      firstName,
      lastName,
      email,
      message,
    }).returning();

    // Gmail notification content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `📬 New message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4f46e5;">New Portfolio Message</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f9fafb; padding: 10px; border-radius: 6px;">${message}</p>
            <hr>
            <p style="font-size: 12px; color: gray;">This message was automatically sent from your portfolio contact form.</p>
          </div>
        </div>
      `,
    };

    // Send email notification
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Message sent successfully and email notification sent!',
      data: result[0],
    });

  } catch (error: any) {
    console.error('❌ Error saving or emailing contact message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again.',
      details: error.message,
    });
  }
});

// GET /api/contact - Get all contact messages (for admin dashboard later)
router.get('/', async (req: Request, res: Response) => {
  try {
    const messages = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);

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
