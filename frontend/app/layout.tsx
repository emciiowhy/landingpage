// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mc Zaldy Yap — Web Developer',
  description:
    'Portfolio of Mc Zaldy Yap, a web developer building fast, responsive apps with Next.js, React and TypeScript.',
  keywords: ['Web Developer', 'Next.js', 'React', 'TypeScript', 'Portfolio', 'Mc Zaldy Yap'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dark-only: the `dark` class is hardcoded and there is no theme toggle.
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5622672077865707" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5622672077865707"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
