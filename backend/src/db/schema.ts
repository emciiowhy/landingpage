// backend/src/db/schema.ts
// ✅ Database schema for contact form submissions (Drizzle ORM)

import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

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

// ─────────────────────────────────────────────────────────────────────────
// ✅ Engagement: likes + comments on portfolio videos and home projects.
//    `targetType` is 'portfolio' | 'project'; `targetId` is the item id.
// ─────────────────────────────────────────────────────────────────────────

// One row per (target, visitor) like. Un-liking deletes the row, so the like
// count is simply COUNT(*) and a visitor can only like a target once.
export const likes = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    targetType: text('target_type').notNull(),
    targetId: text('target_id').notNull(),
    visitorId: text('visitor_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    // Prevent duplicate likes from the same browser on the same item.
    uniqVisitorTarget: uniqueIndex('likes_target_visitor_idx').on(
      t.targetType,
      t.targetId,
      t.visitorId,
    ),
  }),
);

// Public comments (name + body), shown instantly.
export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    targetType: text('target_type').notNull(),
    targetId: text('target_id').notNull(),
    name: varchar('name', { length: 60 }).notNull(),
    body: varchar('body', { length: 600 }).notNull(),
    // Anonymous visitor id of the author — lets a visitor edit/delete their own.
    authorId: text('author_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    byTarget: index('comments_target_idx').on(t.targetType, t.targetId),
  }),
);

// One row per page view (guarded to once-per-session on the client). Total
// views = COUNT(*); unique visitors = COUNT(DISTINCT visitor_id).
export const siteViews = pgTable('site_views', {
  id: serial('id').primaryKey(),
  visitorId: text('visitor_id').notNull(),
  path: text('path').notNull().default('/'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ✅ TypeScript types (auto generated from Drizzle schema)
export type ContactMessage = typeof contactMessages.$inferInsert;
export type ContactMessageRecord = typeof contactMessages.$inferSelect;

export type Contact = typeof contacts.$inferInsert;
export type ContactRecord = typeof contacts.$inferSelect;

export type Like = typeof likes.$inferInsert;
export type CommentRecord = typeof comments.$inferSelect;
export type SiteView = typeof siteViews.$inferInsert;
