// backend/src/routes/contact.ts
// ✅ Contact form API with Drizzle ORM + Email notifications

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import nodemailer from 'nodemailer';

const router = Router();

// ✅ Gmail configuration
const GMAIL_USER = process.env.GMAIL_USER || 'mcmcyap07@gmail.com';
const GMAIL_PASS = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// ✅ POST /api/contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    console.log('📨 Received:', { firstName, lastName, email });

    // ✅ Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
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

    // ✅ Save to database using Drizzle ORM (clean & safe)
    const result = await db.insert(contactMessages).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    }).returning();

    console.log(`✅ Contact saved: ${email}`);

    // ✅ Send response IMMEDIATELY
    res.status(200).json({
      success: true,
      message: '✅ Your message was successfully sent! Thank you for reaching out.',
      data: result[0],
    });

    // ✅ Send emails AFTER response (non-blocking)
    const fullName = `${firstName} ${lastName}`;
    
    setImmediate(async () => {
      try {
        // Email to you
        await transporter.sendMail({
          from: `"Portfolio Contact" <${GMAIL_USER}>`,
          to: GMAIL_USER,
          subject: `📩 New message from ${fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1f2937;">New Contact Form Submission</h2>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #6b7280; font-size: 12px;">Sent from mczaldy.vercel.app</p>
            </div>
          `,
        });

        // Auto-reply to sender
        await transporter.sendMail({
          from: `"Mc Zaldy Yap" <${GMAIL_USER}>`,
          to: email,
          subject: '✅ Thanks for reaching out!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1f2937;">Hey ${firstName}! 👋</h2>
              <p>Thank you for reaching out through my portfolio! I've received your message and will get back to you as soon as possible.</p>
              <p>In the meantime, feel free to explore my work:</p>
              <a href="https://mczaldy.vercel.app" 
                 style="display: inline-block; background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                Visit My Portfolio
              </a>
              <p style="margin-top: 30px;">Best regards,<br><strong>Mc Zaldy Yap</strong></p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          `,
        });

        console.log(`✅ Emails sent to ${email}`);
      } catch (emailErr) {
        console.error('⚠️ Email error (but message was saved):', emailErr);
      }
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
  }
});

// ✅ GET /api/contact - Get all messages (for admin/dashboard)
router.get('/', async (req: Request, res: Response) => {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

export default router;