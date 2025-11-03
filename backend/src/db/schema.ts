// backend/src/db/schema.ts
// ✅ Database schema for contact form submissions (Drizzle ORM)

import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// ✅ Current active messages table (used in contact form API)
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 🔁 Legacy contacts table (optional fallback)
// Still exists in DB but no longer used in API
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ✅ TypeScript types (auto generated from Drizzle schema)
export type ContactMessage = typeof contactMessages.$inferInsert;
export type ContactMessageRecord = typeof contactMessages.$inferSelect;

export type Contact = typeof contacts.$inferInsert;
export type ContactRecord = typeof contacts.$inferSelect;
