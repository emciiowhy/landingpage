'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Trash2, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { API_BASE } from '@/lib/api';

interface AdminComment {
  id: number;
  targetType: string;
  targetId: string;
  name: string;
  body: string;
  createdAt: string;
}

const KEY_STORE = 'admin_key';

export default function AdminCommentsPage() {
  const [key, setKey] = useState('');
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const url = `${API_BASE}/api/engagement/admin/comments`;

  const fetchComments = useCallback(
    async (adminKey: string) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(url, { headers: { 'x-admin-key': adminKey } });
        if (res.status === 401) {
          setError('Wrong admin key.');
          setKey('');
          localStorage.removeItem(KEY_STORE);
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setComments(data.comments ?? []);
        setKey(adminKey);
        localStorage.setItem(KEY_STORE, adminKey);
      } catch {
        setError('Could not load comments. Is the backend running?');
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORE);
    if (saved) fetchComments(saved);
  }, [fetchComments]);

  const remove = async (id: number) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    const prev = comments;
    setComments((list) => list.filter((c) => c.id !== id));
    try {
      const res = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': key },
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      setComments(prev);
    }
  };

  const logout = () => {
    localStorage.removeItem(KEY_STORE);
    setKey('');
    setComments([]);
  };

  // ── Login gate ──
  if (!key) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) fetchComments(input.trim());
          }}
          className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Comment moderation</h1>
          </div>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Admin key"
            autoFocus
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {error && <p className="mt-2 text-sm text-primary">{error}</p>}
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Set <code>ADMIN_KEY</code> in <code>backend/.env</code>.
          </p>
        </form>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comments</h1>
            <p className="text-sm text-muted-foreground">
              {comments.length} total · newest first
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Lock
          </Button>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : error ? (
          <p className="text-sm text-primary">{error}</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {c.name}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {c.targetType} #{c.targetId}
                    </Badge>
                    <span className="text-xs text-muted-foreground/70">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                    {c.body}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="Delete comment"
                  className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
