import { Github, Linkedin, Twitter, Facebook } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/emciiowhy', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/mckiieeyy1107', label: 'Facebook' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="section-container mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div>
          <p className="text-sm font-bold text-foreground">Mc Zaldy Yap</p>
          <p className="text-xs text-muted-foreground">Web developer · Cebu City, Philippines</p>
        </div>
        <div className="flex gap-5">
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
        <p className="text-xs text-muted-foreground/70">
          {`© ${year} Mc Zaldy Yap · Built with Next.js, Tailwind & Framer Motion`}
        </p>
      </div>
    </footer>
  );
}
