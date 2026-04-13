"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const techStack = [
  "Next.js", "React", "TypeScript", "Laravel", "Tailwind CSS",
  "Node.js", "PHP", "Drizzle ORM", "ShadCN", "Vercel",
  "Clerk", "NextAuth", "REST APIs", "MySQL",
];

export function BentoGrid() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let pos = 0;
    let raf: number;
    const animate = () => {
      pos -= 0.45;
      if (pos <= -(el.scrollWidth / 2)) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Featured Project — spans 2 cols */}
        <div
          className="
            md:col-span-2 bg-card border border-border rounded-lg p-6
            flex flex-col justify-between min-h-[220px]
            hover:border-border/80 transition-colors
          "
        >
          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              Featured Project
            </span>
            <h3 className="mt-2 text-xl font-semibold text-card-foreground">
              Carshey Philippines
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Full-stack e-commerce platform for automotive parts — catalog, cart,
              secure checkout, and user accounts. Built with Next.js 14 and deployed
              on Vercel.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Next.js", "React", "Tailwind CSS", "TypeScript"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <a
              href="https://carsheyph.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-card-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              View Live →
            </a>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              Current Status
            </span>
            <div className="flex items-center gap-2 mt-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-card-foreground">
                Open to work
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Available for freelance projects and full-time roles.
              Based in Cebu, PH — remote-friendly.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-5 text-sm font-medium text-card-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Let&apos;s talk →
          </Link>
        </div>

        {/* Tech Stack Marquee — full width */}
        <div className="md:col-span-3 bg-card border border-border rounded-lg py-4 overflow-hidden">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest text-center mb-3">
            Tech Stack
          </p>
          <div className="overflow-hidden">
            <div ref={marqueeRef} className="flex gap-2.5 whitespace-nowrap w-max">
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-card-foreground px-3 py-1 rounded-full border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}