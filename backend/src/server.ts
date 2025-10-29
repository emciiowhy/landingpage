// backend/src/server.ts
// ✅ Main Express server with Neon + Drizzle + CORS + Health Check + Gmail via Nodemailer

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { db } from './db';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mczaldy.vercel.app';

// ✅ Gmail credentials (use an App Password, not your real Gmail password)
const GMAIL_USER = process.env.GMAIL_USER || 'mcmcyap07@gmail.com';
const GMAIL_PASS = process.env.GMAIL_PASS; // should be your Gmail App Password

// ✅ Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// ✅ Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        FRONTEND_URL,
        'https://mczaldy.vercel.app',
        'https://mczaldy.vercel.app/',
        'https://my-portfolio-e4bf.onrender.com',
        'http://localhost:3000',
      ];

      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('🚫 Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test database connection
(async () => {
  try {
    await db.execute(`SELECT NOW()`);
    console.log('✅ Connected to Neon Postgres successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to Neon DB:', err);
  }
})();

// ✅ Contact route
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // ✅ Save to DB
   await db.execute(`
  INSERT INTO contacts (name, email, message)
  VALUES ('${name}', '${email}', '${message}')
`);

    console.log(`✅ Contact saved for ${email}`);

    // ✅ Send email notification to you
    const mailOptionsToYou = {
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `📩 New message from ${name}`,
      html: `
        <h3>New message received from your portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    // ✅ Auto-reply to sender
    const mailOptionsToSender = {
      from: `"Mc Zaldy Yap" <${GMAIL_USER}>`,
      to: email,
      subject: 'Thanks for contacting me!',
      html: `
        <p>Hey ${name},</p>
        <p>Thank you for reaching out! I’ve received your message and will get back to you soon.</p>
        <p>Meanwhile, you can visit my portfolio:</p>
        <a href="https://mczaldy.vercel.app" style="color:#2563eb;">mczaldy.vercel.app</a>
        <br/><br/>
        <p>– Mc Zaldy Yap</p>
      `,
    };

    await transporter.sendMail(mailOptionsToYou);
    await transporter.sendMail(mailOptionsToSender);

    console.log(`✅ Email notifications sent successfully.`);

    res.status(200).json({
      success: true,
      message: 'Message sent and emails delivered successfully!',
    });
  } catch (err) {
    console.error('❌ Error saving or sending contact message:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to save or send message',
      details: (err as Error).message,
    });
  }
});

// ✅ Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const result = await db.execute(`SELECT NOW()`);
    res.status(200).json({
      success: true,
      message: 'Server healthy & DB connected!',
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: (err as Error).message,
    });
  }
});

// ✅ Root route
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h2>🚀 Backend Running on Render</h2>
    <p>✅ DB Connected, ✅ Gmail Email Working, ✅ Contact API Ready</p>
  `);
});

// ✅ 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed Frontend: ${FRONTEND_URL}`);
});
