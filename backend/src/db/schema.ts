// backend/src/db/schema.ts
// Database schema for contact form submissions

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for inserting new contact message
export type ContactMessage = typeof contactMessages.$inferInsert;