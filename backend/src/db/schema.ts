// backend/src/db/schema.ts
// ✅ Database schema for contact form submissions (Drizzle ORM)

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// ✅ Define contact messages table structure
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(), // Auto-increment ID
  firstName: text('first_name').notNull(), // User first name
  lastName: text('last_name').notNull(), // User last name
  email: text('email').notNull(), // User email
  message: text('message').notNull(), // Contact message
  createdAt: timestamp('created_at').defaultNow().notNull(), // Auto timestamp
});

// ✅ TypeScript type for inserting new contact message
export type ContactMessage = typeof contactMessages.$inferInsert;

// ✅ TypeScript type for querying contact messages (optional but useful)
export type ContactMessageRecord = typeof contactMessages.$inferSelect;
