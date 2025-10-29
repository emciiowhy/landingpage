// backend/src/server.ts
// ✅ Main Express server with Neon + Drizzle + CORS + Health Check

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact';
import { db } from './db'; // ✅ Drizzle connection

// ✅ Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mczaldy.vercel.app';

// ✅ Middleware
app.use(
  cors({
    origin: [
      FRONTEND_URL,
      'https://mczaldy.vercel.app', // Vercel live
      'https://my-portfolio-e4bf.onrender.com', // Render backend
      'https://vercel.app', // preview builds
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test database connection at startup
(async () => {
  try {
    await db.execute(`SELECT NOW()`); // test connection
    console.log('✅ Connected to Neon Postgres successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to Neon DB:', err);
  }
})();

// ✅ Routes
app.use('/api/contact', contactRoutes);

// ✅ Health check endpoint
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

// ✅ Root route
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h2>🚀 Backend Running on Render</h2>
    <p>✅ DB Connected, ✅ CORS Enabled, ✅ Contact API Ready</p>
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
