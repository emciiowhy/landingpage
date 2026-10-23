// lib/visitor.ts
// A stable anonymous id per browser, used to guard likes (one per visitor) and
// to de-duplicate view counts. No personal data — just a random UUID.

const KEY = 'portfolio_visitor_id';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
