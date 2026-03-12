'use client';

import Link from 'next/link';
import { BLOG_POSTS } from '@/constants/blog';

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Blogs</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to the blog section! Read my latest articles, tips, and insights.
            </p>
          </div>

          <div className="space-y-4">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-card border border-border rounded-2xl px-6 py-5 md:px-8 md:py-6 hover:border-primary hover:shadow-lg transition-all"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                  {post.title}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mb-3">
                  {post.date} • {post.author}
                </p>
                <p className="text-sm md:text-base text-muted-foreground">{post.overview}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}