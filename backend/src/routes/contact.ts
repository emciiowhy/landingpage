// backend/src/routes/contact.ts
import { Router, Request, Response } from 'express';
import { db } from '../db';
import nodemailer from 'nodemailer';
import { sql } from 'drizzle-orm';

const router = Router();

// ✅ Gmail transporter (reuse from server.ts)
const GMAIL_USER = process.env.GMAIL_USER || 'mcmcyap07@gmail.com';
const GMAIL_PASS = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

router.post('/', async (req: Request, res: Response) => {
  let responseSent = false;

  try {
    const { firstName, lastName, email, message } = req.body;
    const name = `${firstName} ${lastName}`.trim();

    console.log('📨 Received contact form:', { name, email });

    // ✅ Validate
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

    // ✅ Save to database using raw SQL (matching your existing table)
    await db.execute(
  sql`INSERT INTO contacts (name, email, message) VALUES (${name}, ${email}, ${message})`
);

    console.log(`✅ Contact saved for ${email}`);

    // ✅ Send response IMMEDIATELY (don't wait for email)
    if (!responseSent) {
      responseSent = true;
      res.status(200).json({
        success: true,
        message: '✅ Your message was successfully sent! Thank you for reaching out.',
      });
    }

    // ✅ Send emails AFTER response (non-blocking)
    try {
      // Email to you
      await transporter.sendMail({
        from: `"Portfolio Contact" <${GMAIL_USER}>`,
        to: GMAIL_USER,
        subject: `📩 New message from ${name}`,
        html: `
          <h3>New message received from your portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br>${message}</p>
        `,
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: `"Mc Zaldy Yap" <${GMAIL_USER}>`,
        to: email,
        subject: 'Thanks for contacting me!',
        html: `
          <p>Hey ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you soon.</p>
          <p>Meanwhile, you can visit my portfolio:</p>
          <a href="https://mczaldy.vercel.app" style="color:#2563eb;">mczaldy.vercel.app</a>
          <br/><br/>
          <p>– Mc Zaldy Yap</p>
        `,
      });

      console.log(`✅ Email notifications sent successfully.`);
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('⚠️ Email sending failed (but contact was saved):', emailError);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again.',
      });
    }
  }
});

// ✅ Get all contacts
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.execute(`SELECT * FROM contacts ORDER BY created_at DESC`);
    
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

export default router;