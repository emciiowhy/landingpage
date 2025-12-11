// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mc Zaldy Yap - Software Developer',
  description:
    'Portfolio of Mc Zaldy Yap, a passionate Software Developer specializing in web and mobile applications.',
  keywords: ['Software Developer', 'Web Development', 'Portfolio', 'Mc Zaldy Yap'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google AdSense Verification Meta Tag */}
        <meta
          name="google-adsense-account"
          content="ca-pub-5622672077865707"
        />

        {/* Google AdSense Auto Ads Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5622672077865707"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className={inter.className}>
        {/* Navigation appears at the top of every page */}
        <Navigation />

        {/* Main content */}
        <main className="min-h-screen pt-16">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
