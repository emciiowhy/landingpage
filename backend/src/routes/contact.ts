// backend/src/routes/contact.ts
// API route for handling contact form submissions

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact - Handle contact form submission
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

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // ✅ Save to database
    const result = await db
      .insert(contactMessages)
      .values({
        firstName,
        lastName,
        email,
        message,
      })
      .returning();

    console.log('✅ Contact saved for', email);

    // ✅ Send success response immediately
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: result[0],
    });

    // ✅ Send emails asynchronously (no blocking)
    const fullName = `${firstName} ${lastName}`;

    // Email 1: Notify you
    const notifyOwner = resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'mcmcyap07@gmail.com', // your email
      subject: `📬 New Message from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
        <hr/>
        <small>Sent from your portfolio website</small>
      `,
    });

    // Email 2: Auto-reply to sender
    const autoReply = resend.emails.send({
      from: 'Mc Zaldy Yap <onboarding@resend.dev>',
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <h2>Hey ${firstName},</h2>
        <p>Thank you for contacting me! I’ve received your message and will get back to you soon.</p>
        <p>Have a great day!</p>
        <br/>
        <strong>– Mc Zaldy Yap</strong><br/>
        <a href="https://mczaldy.vercel.app">https://mczaldy.vercel.app</a>
      `,
    });

    await Promise.allSettled([notifyOwner, autoReply]);

  } catch (error) {
    console.error('❌ Error saving contact message:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again.',
      });
    }
  }
});

// GET /api/contact - Fetch all contact messages
router.get('/', async (req: Request, res: Response) => {
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
