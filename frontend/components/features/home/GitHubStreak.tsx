/* eslint-disable @next/next/no-img-element */
import { ProfileCard } from '@/components/common/ProfileCard';
import { Github } from 'lucide-react';

const GH_USER = 'emciiowhy';

/**
 * GitHub activity widget for the sidebar. Uses external, theme-able image
 * services (no API key) so it renders a live streak + red contribution grid.
 * Plain <img> is used intentionally to avoid next/image remote-domain config.
 */
export function GitHubStreak() {
  return (
    <ProfileCard
      title="GitHub Streak"
      bodyClassName="px-2 pb-3"
      action={
        <a
          href={`https://github.com/${GH_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary transition-opacity hover:opacity-80"
          aria-label="Open GitHub profile"
        >
          <Github className="h-4 w-4" />
        </a>
      }
    >
      <div className="space-y-3">
        <img
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${GH_USER}&theme=black-ice&hide_border=true&background=1A1A1A&stroke=292929&ring=E50914&fire=E50914&currStreakLabel=E50914&sideLabels=A3A3A3&dates=A3A3A3&currStreakNum=FAFAFA&sideNums=FAFAFA`}
          alt={`${GH_USER} GitHub streak stats`}
          loading="lazy"
          className="w-full rounded-lg"
        />
        <img
          src={`https://ghchart.rshah.org/E50914/${GH_USER}`}
          alt={`${GH_USER} GitHub contribution graph`}
          loading="lazy"
          className="w-full rounded-lg bg-secondary/40 p-2"
        />
      </div>
    </ProfileCard>
  );
}
