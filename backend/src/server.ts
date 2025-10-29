// backend/src/server.ts
// 🚀 Main Express server — ready for Render + Neon + Portfolio Frontend

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact';

// ✅ Load environment variables
dotenv.config();

const app: Application = express();

// ✅ Config values
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ✅ Middleware setup
app.use(
  cors({
    origin: [FRONTEND_URL, 'https://my-portfolio-e4bf.onrender.com'], // allow both local + deployed
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use('/api/contact', contactRoutes);

// ✅ Health check endpoint (for Render pings)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Root endpoint (optional)
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h2>🚀 Portfolio Backend Active</h2>
    <p>Status: Running</p>
    <p>Visit <a href="/api/health">/api/health</a> to check server status.</p>
  `);
});

// ✅ 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`🌐 CORS allowed origin: ${FRONTEND_URL}`);
});
