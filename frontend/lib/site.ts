// lib/site.ts
// Single source of truth for site-wide SEO/metadata.
//
// When you buy your domain, set it once in frontend/.env.local:
//   NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
// Everything (metadata, Open Graph, sitemap, robots) picks it up automatically.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-domain.com'
).replace(/\/$/, '');

export const siteConfig = {
  name: 'Mc Zaldy Yap',
  title: 'Mc Zaldy Yap — Web Developer & Video Editor',
  description:
    'Portfolio of Mc Zaldy Yap — a web developer and video editor based in Cebu, PH. Fast, conversion-focused websites with Next.js, React and TypeScript, plus short-form edits, color grades and promos.',
  url: siteUrl,
  locale: 'en_PH',
  authorTwitter: '@emciiowhy07',
} as const;
