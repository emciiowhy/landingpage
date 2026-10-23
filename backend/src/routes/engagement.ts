// backend/src/routes/engagement.ts
// Likes (anonymous tap counter), public comments, and a site view counter.
// Scope targets: "portfolio" videos and home "project" cards.

import { Router, Request, Response } from 'express';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { likes, comments, siteViews } from '../db/schema';

const router = Router();

const VALID_TYPES = new Set(['portfolio', 'project']);
const isValidType = (t: string) => VALID_TYPES.has(t);

/**
 * Create the engagement tables if they don't exist yet, so the feature works
 * even before `npm run db:push` is run. Idempotent — safe to call on boot.
 */
export async function ensureEngagementTables() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        visitor_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await db.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS likes_target_visitor_idx ON likes (target_type, target_id, visitor_id)`,
    );
    await db.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        name VARCHAR(60) NOT NULL,
        body VARCHAR(600) NOT NULL,
        author_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    // Add author_id to older comment tables that pre-date this column.
    await db.execute(
      `ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_id TEXT`,
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS comments_target_idx ON comments (target_type, target_id)`,
    );
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_views (
        id SERIAL PRIMARY KEY,
        visitor_id TEXT NOT NULL,
        path TEXT NOT NULL DEFAULT '/',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    console.log('✅ Engagement tables ready (likes, comments, site_views)');
  } catch (err) {
    console.error('❌ Failed ensuring engagement tables:', err);
  }
}

async function likeCountFor(type: string, id: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(and(eq(likes.targetType, type), eq(likes.targetId, id)));
  return row?.count ?? 0;
}

// ─── Admin (comment moderation) ────────────────────────────────────────────
// Guarded by a shared secret sent in the `x-admin-key` header. Set ADMIN_KEY
// in backend/.env; the default below is only a dev placeholder — change it.
const ADMIN_KEY = process.env.ADMIN_KEY || 'mczy-admin-change-me';

function requireAdmin(req: Request, res: Response): boolean {
  const key = req.header('x-admin-key');
  if (!key || key !== ADMIN_KEY) {
    res.status(401).json({ success: false, error: 'Unauthorized.' });
    return false;
  }
  return true;
}

// NOTE: these must be registered before the generic "/:type/:id" route below,
// otherwise "/admin/comments" would match it as type="admin".
router.get('/admin/comments', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(500);
    res.json({ success: true, comments: rows });
  } catch (err) {
    console.error('❌ admin comments error:', err);
    res.status(500).json({ success: false, error: 'Failed to load comments.' });
  }
});

router.delete('/admin/comments/:id', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: 'Invalid id.' });
    }
    await db.delete(comments).where(eq(comments.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error('❌ admin delete error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete comment.' });
  }
});

// ── GET /api/engagement/:type/:id?visitorId= ───────────────────────────────
// Returns like count, whether this visitor liked it, and the comment list.
router.get('/:type/:id', async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const visitorId = String(req.query.visitorId || '');
    if (!isValidType(type)) {
      return res.status(400).json({ success: false, error: 'Invalid target type.' });
    }

    const [likeCount, commentRows, likedRows] = await Promise.all([
      likeCountFor(type, id),
      db
        .select()
        .from(comments)
        .where(and(eq(comments.targetType, type), eq(comments.targetId, id)))
        .orderBy(desc(comments.createdAt))
        .limit(200),
      visitorId
        ? db
            .select({ id: likes.id })
            .from(likes)
            .where(
              and(
                eq(likes.targetType, type),
                eq(likes.targetId, id),
                eq(likes.visitorId, visitorId),
              ),
            )
            .limit(1)
        : Promise.resolve([] as { id: number }[]),
    ]);

    // Expose a per-visitor `mine` flag (so the author can edit/delete) without
    // leaking other people's author ids.
    const shaped = commentRows.map(({ authorId, ...c }) => ({
      ...c,
      mine: Boolean(visitorId) && authorId === visitorId,
    }));

    res.json({
      success: true,
      likeCount,
      liked: likedRows.length > 0,
      comments: shaped,
    });
  } catch (err) {
    console.error('❌ engagement GET error:', err);
    res.status(500).json({ success: false, error: 'Failed to load engagement.' });
  }
});

// ── POST /api/engagement/:type/:id/like  { visitorId } ─────────────────────
// Toggles the like for this visitor and returns the fresh count + state.
router.post('/:type/:id/like', async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const visitorId = String(req.body?.visitorId || '').trim();
    if (!isValidType(type)) {
      return res.status(400).json({ success: false, error: 'Invalid target type.' });
    }
    if (!visitorId) {
      return res.status(400).json({ success: false, error: 'Missing visitor id.' });
    }

    const where = and(
      eq(likes.targetType, type),
      eq(likes.targetId, id),
      eq(likes.visitorId, visitorId),
    );
    const existing = await db.select({ id: likes.id }).from(likes).where(where).limit(1);

    let liked: boolean;
    if (existing.length > 0) {
      await db.delete(likes).where(where);
      liked = false;
    } else {
      await db
        .insert(likes)
        .values({ targetType: type, targetId: id, visitorId })
        .onConflictDoNothing();
      liked = true;
    }

    res.json({ success: true, liked, likeCount: await likeCountFor(type, id) });
  } catch (err) {
    console.error('❌ engagement like error:', err);
    res.status(500).json({ success: false, error: 'Failed to update like.' });
  }
});

// ── POST /api/engagement/:type/:id/comment  { name, body } ─────────────────
router.post('/:type/:id/comment', async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    if (!isValidType(type)) {
      return res.status(400).json({ success: false, error: 'Invalid target type.' });
    }

    const name = String(req.body?.name || '').trim();
    const body = String(req.body?.body || '').trim();
    const authorId = String(req.body?.visitorId || '').trim() || null;

    if (name.length < 1 || name.length > 60) {
      return res.status(400).json({ success: false, error: 'Name must be 1–60 characters.' });
    }
    if (body.length < 1 || body.length > 600) {
      return res.status(400).json({ success: false, error: 'Comment must be 1–600 characters.' });
    }

    const [saved] = await db
      .insert(comments)
      .values({ targetType: type, targetId: id, name, body, authorId })
      .returning();

    // Strip authorId from the response; mark it as the author's own.
    const { authorId: _omit, ...rest } = saved;
    res.status(201).json({ success: true, comment: { ...rest, mine: true } });
  } catch (err) {
    console.error('❌ engagement comment error:', err);
    res.status(500).json({ success: false, error: 'Failed to post comment.' });
  }
});

// ── PATCH /api/engagement/:type/:id/comment/:commentId  { visitorId, body } ─
// Edit your own comment (author-guarded by visitor id).
router.patch('/:type/:id/comment/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const visitorId = String(req.body?.visitorId || '').trim();
    const body = String(req.body?.body || '').trim();
    if (!Number.isInteger(commentId)) {
      return res.status(400).json({ success: false, error: 'Invalid comment id.' });
    }
    if (!visitorId) {
      return res.status(401).json({ success: false, error: 'Missing visitor id.' });
    }
    if (body.length < 1 || body.length > 600) {
      return res.status(400).json({ success: false, error: 'Comment must be 1–600 characters.' });
    }

    const [existing] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Comment not found.' });
    }
    if (existing.authorId !== visitorId) {
      return res.status(403).json({ success: false, error: 'Not your comment.' });
    }

    const [updated] = await db
      .update(comments)
      .set({ body })
      .where(eq(comments.id, commentId))
      .returning();
    const { authorId: _omit, ...rest } = updated;
    res.json({ success: true, comment: { ...rest, mine: true } });
  } catch (err) {
    console.error('❌ engagement edit error:', err);
    res.status(500).json({ success: false, error: 'Failed to edit comment.' });
  }
});

// ── DELETE /api/engagement/:type/:id/comment/:commentId  { visitorId } ──────
// Delete your own comment (author-guarded). visitorId via body or query.
router.delete('/:type/:id/comment/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const visitorId = String(req.body?.visitorId || req.query.visitorId || '').trim();
    if (!Number.isInteger(commentId)) {
      return res.status(400).json({ success: false, error: 'Invalid comment id.' });
    }
    if (!visitorId) {
      return res.status(401).json({ success: false, error: 'Missing visitor id.' });
    }

    const [existing] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Comment not found.' });
    }
    if (existing.authorId !== visitorId) {
      return res.status(403).json({ success: false, error: 'Not your comment.' });
    }

    await db.delete(comments).where(eq(comments.id, commentId));
    res.json({ success: true });
  } catch (err) {
    console.error('❌ engagement delete error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete comment.' });
  }
});

async function viewTotals() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      unique: sql<number>`count(distinct ${siteViews.visitorId})::int`,
    })
    .from(siteViews);
  return { total: row?.total ?? 0, unique: row?.unique ?? 0 };
}

// ── POST /api/engagement/views  { visitorId, path } ────────────────────────
// Records a view (client guards to once per session) and returns totals.
router.post('/views', async (req: Request, res: Response) => {
  try {
    const visitorId = String(req.body?.visitorId || '').trim();
    const path = String(req.body?.path || '/').slice(0, 300);
    if (visitorId) {
      await db.insert(siteViews).values({ visitorId, path });
    }
    res.json({ success: true, ...(await viewTotals()) });
  } catch (err) {
    console.error('❌ engagement view error:', err);
    res.status(500).json({ success: false, error: 'Failed to record view.' });
  }
});

// ── GET /api/engagement/views ──────────────────────────────────────────────
router.get('/views', async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, ...(await viewTotals()) });
  } catch (err) {
    console.error('❌ engagement views GET error:', err);
    res.status(500).json({ success: false, error: 'Failed to load views.' });
  }
});

export default router;
