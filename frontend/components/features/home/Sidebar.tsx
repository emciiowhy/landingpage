import Link from 'next/link';
import Image from 'next/image';
import { ProfileCard } from '@/components/common/ProfileCard';
import { GitHubStreak } from '@/components/features/home/GitHubStreak';
import {
  MapPin,
  Mail,
  Globe,
  Languages,
  Phone,
  Github,
  Linkedin,
  Facebook,
  Briefcase,
} from 'lucide-react';

const personal = [
  { icon: MapPin, label: 'From Cebu City, Philippines' },
  { icon: Mail, label: 'mcmcyap07@gmail.com', href: 'mailto:mcmcyap07@gmail.com' },
  { icon: Phone, label: '+63 915 515 2314', href: 'tel:+639155152314' },
  { icon: Globe, label: 'Philippines' },
  { icon: Languages, label: 'Filipino, English' },
];

// Non-dev roles kept as supporting background, not the headline.
const experience = [
  { role: 'Data Scraper', org: 'Lead Generation (Facebook Analytics)', period: '2022 – 2025' },
  { role: 'Telephone Interviewer', org: 'Dynata', period: '2024' },
  { role: 'ESL Teacher', org: 'First English Global', period: '2022' },
];

const skillGroups: { label: string; tags: string[] }[] = [
  {
    label: 'Frontend',
    tags: ['#nextjs', '#react', '#typescript', '#javascript', '#vue', '#quasar', '#tailwindcss', '#html/css'],
  },
  { label: 'Backend', tags: ['#php', '#laravel', '#nodejs', '#express', '#restapi'] },
  { label: 'Database', tags: ['#neondb', '#mysql', '#postgresql'] },
  { label: 'Tools', tags: ['#git', '#github', '#vercel', '#figma', '#framer-motion'] },
];

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/emciiowhy' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/emciiowhy' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/mckiieeyy1107' },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4">
      {/* Intro */}
      <ProfileCard title="Intro">
        <ul className="space-y-3 text-sm text-muted-foreground">
          {personal.map(({ icon: Icon, label, href }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              {href ? (
                <a href={href} className="transition-colors hover:text-foreground">
                  {label}
                </a>
              ) : (
                <span>{label}</span>
              )}
            </li>
          ))}
        </ul>
      </ProfileCard>

      {/* Work Experience (background) */}
      <ProfileCard title="Work Experience">
        <ul className="space-y-4">
          {experience.map((exp) => (
            <li key={exp.role} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{exp.role}</p>
                <p className="text-xs text-muted-foreground">{exp.org}</p>
                <p className="text-xs text-muted-foreground/70">{exp.period}</p>
              </div>
            </li>
          ))}
        </ul>
      </ProfileCard>

      {/* Tech Stack */}
      <ProfileCard title="Tech Stack">
        <div className="space-y-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ProfileCard>

      {/* Education */}
      <ProfileCard title="Education">
        <div className="flex gap-3">
          <span className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white">
            <Image
              src="/images/cpc-logo.jpg"
              alt="Cordova Public College logo"
              fill
              className="object-contain p-0.5"
            />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Cordova Public College</p>
            <p className="text-xs text-muted-foreground">BS in Information Technology</p>
            <p className="text-xs text-muted-foreground/70">Currently pursuing</p>
          </div>
        </div>
      </ProfileCard>

      {/* GitHub Streak */}
      <GitHubStreak />

      {/* Social Links */}
      <ProfileCard title="Social Links">
        <ul className="space-y-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                className="flex items-center gap-3 text-sm text-primary transition-opacity hover:opacity-80"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </ProfileCard>
    </aside>
  );
}
