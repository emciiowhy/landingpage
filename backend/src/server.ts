// backend/src/server.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact';
import { db } from './db';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mczaldy.vercel.app';

// ✅ Allowed origins
const allowedOrigins = [
  FRONTEND_URL,
  'https://mczaldy.vercel.app',
  'http://localhost:3000',
];

// ✅ CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.warn('🚫 Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

// ✅ Routes
app.use('/api/contact', contactRoutes);

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
    });
  }
});

// ✅ Root route
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h2>🚀 Backend Running</h2>
    <p>✅ DB Connected, ✅ Contact API Ready</p>
  `);
});

// ✅ 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
});