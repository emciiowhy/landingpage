import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Editing Reel',
  description:
    'Video editing portfolio of Mc Zaldy Yap — short-form edits, color grades, and promos. Hover to preview, click to watch in full.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio — Editing Reel | Mc Zaldy Yap',
    description:
      'Short-form edits, color grades, and promos by Mc Zaldy Yap.',
    url: '/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
