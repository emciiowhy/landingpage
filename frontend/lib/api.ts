// lib/api.ts
// Base URL for the Express backend (same pattern the contact form uses).
export const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://my-portfolio-backend-rv94.onrender.com'
    : 'http://localhost:5000';
