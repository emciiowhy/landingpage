// app/layout.tsx
// This is the root layout that wraps all pages
// Navigation and Footer will appear on every page

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO - Shows up in browser tabs and search results
export const metadata: Metadata = {
  title: 'Mc Zaldy Yap - Software Developer',
  description: 'Portfolio of Mc Zaldy Yap, a passionate Software Developer specializing in web and mobile applications.',
  keywords: ['Software Developer', 'Web Development', 'Portfolio', 'Mc Zaldy Yap'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {/* Navigation appears at the top of every page */}
        <Navigation />
        
        {/* Main content area - adds padding for fixed navigation */}
        <main className="min-h-screen pt-16">
          {children}
        </main>
        
        {/* Footer appears at the bottom of every page */}
        <Footer />
      </body>
    </html>
  );
}