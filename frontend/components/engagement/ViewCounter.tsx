'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { API_BASE } from '@/lib/api';
import { getVisitorId } from '@/lib/visitor';

const SESSION_FLAG = 'portfolio_view_recorded';

/**
 * Records one site view per browser session and shows the running totals.
 * Fails silently (renders nothing) if the backend is unreachable.
 */
export function ViewCounter() {
  const [total, setTotal] = useState<number | null>(null);
  const [unique, setUnique] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_FLAG);
        let res: Response;
        if (alreadyCounted) {
          res = await fetch(`${API_BASE}/api/engagement/views`);
        } else {
          res = await fetch(`${API_BASE}/api/engagement/views`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId: getVisitorId(),
              path: window.location.pathname,
            }),
          });
          sessionStorage.setItem(SESSION_FLAG, '1');
        }
        const data = await res.json();
        if (!cancelled && data.success) {
          setTotal(data.total ?? 0);
          setUnique(data.unique ?? 0);
        }
      } catch {
        // backend offline — stay hidden
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (total === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      title={`${unique ?? 0} unique visitors`}
    >
      <Eye className="h-3.5 w-3.5" />
      {total.toLocaleString()} views
    </span>
  );
}
