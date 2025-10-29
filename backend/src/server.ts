// backend/src/server.ts
// ✅ Main Express server with Neon + Drizzle + CORS + Health Check + Email via Resend

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { Resend } from 'resend';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mczaldy.vercel.app';

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.YOUR_EMAIL || 'mcmcyap07@gmail.com';

// ✅ Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        FRONTEND_URL,
        'https://mczaldy.vercel.app',
        'https://mczaldy.vercel.app/',
        'https://my-portfolio-e4bf.onrender.com',
        'https://vercel.app',
        'http://localhost:3000',
      ];

      if (!origin) return callback(null, true); // Allow Postman or server-to-server
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

// ✅ Test DB connection
(async () => {
  try {
    await db.execute(`SELECT NOW()`);
    console.log('✅ Connected to Neon Postgres successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to Neon DB:', err);
  }
})();

// ✅ Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const result = await db.execute(`SELECT NOW()`);
    res.status(200).json({
      success: true,
      message: 'Server is healthy & DB connected!',
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

// ✅ Contact API route (simple example)
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    // ✅ Save to DB (optional)
    await db.execute(
  `INSERT INTO contacts (name, email, message) VALUES ('${name}', '${email}', '${message}')`
);

    console.log(`✅ Contact saved for ${email}`);

    // ✅ Send email notification to you
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `📩 New message from ${name}`,
      html: `
        <h3>New contact message from your portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log(`✅ Notification email sent to ${ADMIN_EMAIL}`);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Error saving or emailing contact message:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to save or send message',
      details: (err as Error).message,
    });
  }
});

// ✅ Root route
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h2>🚀 Backend Running on Render</h2>
    <p>✅ DB Connected, ✅ CORS Enabled, ✅ Contact API Ready, ✅ Resend Email Working</p>
  `);
});

// ✅ 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed Frontend: ${FRONTEND_URL}`);
});
