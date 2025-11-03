// backend/src/routes/contact.ts
// ✅ Contact form with proper email configuration

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import nodemailer from 'nodemailer';

const router = Router();

// ✅ Use the correct environment variables from your .env
const EMAIL_USER = process.env.EMAIL_USER || process.env.SMTP_USER || 'mcmcyap07@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

// ✅ Only create transporter if password exists
if (EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
    });
    console.log('✅ Email transporter configured with:', EMAIL_USER);
  } catch (err) {
    console.error('❌ Failed to create email transporter:', err);
  }
} else {
  console.warn('⚠️ EMAIL_PASS not set - emails will be skipped');
}

// ✅ POST /api/contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    console.log('📨 Received contact form:', { firstName, lastName, email });

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

    // ✅ Save to database FIRST (this always works!)
    const result = await db.insert(contactMessages).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    }).returning();

    console.log(`✅ Contact saved to database: ${email}`);

    // ✅ SEND SUCCESS RESPONSE IMMEDIATELY
    res.status(200).json({
      success: true,
      message: '✅ Your message was successfully sent! Thank you for reaching out.',
      data: result[0],
    });

    // ✅ Try sending emails AFTER response (won't block user)
    if (transporter) {
      const fullName = `${firstName} ${lastName}`;
      
      // Fire and forget - don't wait for email
      sendEmailsAsync(transporter, fullName, email, message, EMAIL_USER)
        .then(() => console.log(`✅ Emails sent successfully to ${email}`))
        .catch(err => console.warn(`⚠️ Email failed (but message was saved):`, err.message));
    } else {
      console.log('ℹ️ Email transporter not available, skipping email notifications');
    }

  } catch (error: any) {
    console.error('❌ Error saving contact:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
  }
});

// ✅ Helper function to send emails with timeout protection
async function sendEmailsAsync(
  transporter: nodemailer.Transporter,
  fullName: string,
  email: string,
  message: string,
  senderEmail: string
) {
  // Race against 15-second timeout
  return Promise.race([
    (async () => {
      // Email notification to you
      await transporter.sendMail({
        from: `"Portfolio Contact" <${senderEmail}>`,
        to: senderEmail,
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
        from: `"Mc Zaldy Yap" <${senderEmail}>`,
        to: email,
        subject: '✅ Thanks for reaching out!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hey ${fullName.split(' ')[0]}! 👋</h2>
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
    })(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout after 15 seconds')), 15000)
    )
  ]);
}

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
