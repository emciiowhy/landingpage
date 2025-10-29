// backend/src/db/index.ts
// ✅ Database connection setup for Neon + Drizzle ORM

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// ✅ Load the database URL from the environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL environment variable is not set');
}

// ✅ Create Neon HTTP client (for serverless Postgres)
const sql = neon(databaseUrl);

// ✅ Initialize Drizzle ORM with schema
export const db = drizzle(sql, { schema });

// ✅ Optional: Quick connection check (you can remove in production)
(async () => {
  try {
    await sql`SELECT 1`;
    console.log('✅ Connected to Neon Postgres successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();
