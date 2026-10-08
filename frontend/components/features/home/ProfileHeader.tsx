import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, Facebook, FileText, MessageCircle, BadgeCheck } from 'lucide-react';

const socials = [
  { icon: Linkedin, href: 'https://linkedin.com/in/emciiowhy', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/mckiieeyy1107', label: 'Facebook' },
];

const stackTags = ['Next.js', 'Vue', 'TypeScript', 'Laravel', 'Tailwind CSS'];

/**
 * Facebook-profile header: wide cover banner + overlapping circular avatar,
 * name with verified tick, headline, and primary actions in Netflix red.
 */
export function ProfileHeader() {
  return (
    <header className="overflow-hidden rounded-b-xl border border-t-0 border-border/70 bg-card shadow-card">
      {/* Cover banner — pure CSS: dark gradient + red glow + dot grid */}
      <div className="relative h-44 w-full overflow-hidden sm:h-56 md:h-64">
        {/* Base diagonal gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a0a_0%,#141414_55%,#1e1e1e_100%)]" />
        {/* Netflix-red glows */}
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/25 blur-[90px]" />
        <div className="absolute right-1/3 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-[80px]" />
        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:22px_22px]" />
        {/* Bottom fade into the card for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </div>

      {/* Identity row */}
      <div className="section-container relative -mt-14 pb-5 sm:-mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-card shadow-card sm:h-36 sm:w-36">
              <Image src="/images/profile.jpg" alt="Mc Zaldy Yap" fill className="object-cover" priority />
            </div>

            <div className="pb-1">
              <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-3xl">
                Mc Zaldy Yap
                <BadgeCheck className="h-5 w-5 text-primary drop-shadow-none" aria-label="Verified" />
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
                I build fast, conversion-focused websites and web apps that help businesses grow.{' '}
                <span className="text-foreground">Next.js</span> ·{' '}
                <span className="text-foreground">Vue</span> ·{' '}
                <span className="text-foreground">Laravel</span> — based in Cebu PH, available worldwide. 
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stackTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="flex gap-2">
              <Link href="/resume.pdf" target="_blank">
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Résumé
                </Button>
              </Link>
              <Link href="#contact">
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message me
                </Button>
              </Link>
            </div>
            <div className="flex gap-3 sm:justify-end">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
