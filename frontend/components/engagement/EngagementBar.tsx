'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Heart,
  Send,
  MessageCircle,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { getVisitorId } from '@/lib/visitor';

type EngagementTarget = 'portfolio' | 'project';

interface CommentItem {
  id: number;
  name: string;
  body: string;
  createdAt: string;
  mine?: boolean;
}

const NAME_KEY = 'portfolio_commenter_name';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Likes (anonymous tap counter) + public comments for a portfolio video or a
 * home project. A visitor can edit/delete their own comments. Persists to the
 * Express/Neon backend via /api/engagement.
 */
export function EngagementBar({
  targetType,
  targetId,
}: {
  targetType: EngagementTarget;
  targetId: string;
}) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Inline edit state.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');

  const base = `${API_BASE}/api/engagement/${targetType}/${targetId}`;

  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved) setName(saved);
  }, []);

  // Load with a few retries so a cold/booting backend doesn't show a hard error.
  const load = useCallback(async () => {
    setLoading(true);
    const delays = [0, 1000, 2500, 5000];
    for (let i = 0; i < delays.length; i++) {
      if (delays[i]) await sleep(delays[i]);
      try {
        const vid = getVisitorId();
        const res = await fetch(`${base}?visitorId=${encodeURIComponent(vid)}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setLikeCount(data.likeCount ?? 0);
        setLiked(Boolean(data.liked));
        setComments(data.comments ?? []);
        setError(false);
        setLoading(false);
        return;
      } catch {
        // keep retrying
      }
    }
    setError(true);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      const res = await fetch(`${base}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        setError(false);
      }
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const b = body.trim();
    if (!n || !b || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${base}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, body: b, visitorId: getVisitorId() }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        localStorage.setItem(NAME_KEY, n);
        setComments((prev) => [data.comment, ...prev]);
        setBody('');
        setError(false);
      }
    } catch {
      // keep the text so the user can retry
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: CommentItem) => {
    setEditingId(c.id);
    setEditBody(c.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody('');
  };

  const saveEdit = async (c: CommentItem) => {
    const b = editBody.trim();
    if (!b) return;
    try {
      const res = await fetch(`${base}/comment/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: getVisitorId(), body: b }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) =>
          prev.map((x) => (x.id === c.id ? { ...x, body: data.comment.body } : x)),
        );
        cancelEdit();
      }
    } catch {
      // leave edit open to retry
    }
  };

  const deleteComment = async (c: CommentItem) => {
    if (!window.confirm('Delete this comment?')) return;
    // optimistic removal
    const prev = comments;
    setComments((list) => list.filter((x) => x.id !== c.id));
    try {
      const res = await fetch(`${base}/comment/${c.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      setComments(prev); // roll back
    }
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      {/* Like + count */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleLike}
          disabled={loading}
          aria-pressed={liked}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors',
            liked
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          {likeCount}
        </button>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          {comments.length}
        </span>
      </div>

      {/* Comment form */}
      <form onSubmit={submitComment} className="mt-4 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            maxLength={600}
            className="min-h-[40px] w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            size="icon"
            disabled={submitting || !name.trim() || !body.trim()}
            aria-label="Post comment"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Comment list */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="group rounded-lg bg-secondary/60 px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {c.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/70">
                    {timeAgo(c.createdAt)}
                  </span>
                  {c.mine && editingId !== c.id && (
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        aria-label="Edit comment"
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteComment(c)}
                        aria-label="Delete comment"
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {editingId === c.id ? (
                <div className="mt-1.5 flex items-end gap-2">
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={2}
                    maxLength={600}
                    autoFocus
                    className="min-h-[38px] w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => saveEdit(c)}
                      aria-label="Save"
                      className="rounded-md bg-primary p-1.5 text-primary-foreground"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      aria-label="Cancel"
                      className="rounded-md border border-border p-1.5 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {c.body}
                </p>
              )}
            </div>
          ))
        ) : error ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load comments. Is the backend running?
            </p>
            <Button variant="outline" size="sm" onClick={load}>
              Retry
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No comments yet — be the first.
          </p>
        )}
      </div>
    </div>
  );
}
