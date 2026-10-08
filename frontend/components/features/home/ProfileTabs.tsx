'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
];

/**
 * Sticky Facebook-style tab bar with a Netflix-red active underline.
 * Clicking scrolls to the matching section; the active tab tracks scroll.
 */
export function ProfileTabs() {
  const [active, setActive] = useState('projects');

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-x border-b border-border/70 bg-card/95 backdrop-blur-md">
      <div className="section-container flex gap-1">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative px-4 py-3 text-sm font-semibold transition-colors',
              active === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-primary transition-opacity',
                active === tab.id ? 'opacity-100' : 'opacity-0'
              )}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
