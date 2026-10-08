'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Play, SlidersHorizontal } from 'lucide-react';
import { ProfileCard } from '@/components/common/ProfileCard';
import { Button } from '@/components/ui/button';
import { ProjectModal } from '@/components/features/home/ProjectModal';
import { projects, projectCategories, type Project, type ProjectCategory } from '@/lib/projects';
import { cn } from '@/lib/utils';

/** Netflix-style poster card: hover scales up and reveals a "Live preview" badge. */
function ProjectPoster({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <button
      onClick={() => onOpen(project)}
      className="group relative w-[260px] shrink-0 overflow-hidden rounded-lg border border-border/70 bg-secondary text-left transition-all duration-300 hover:z-10 hover:border-primary/60 hover:shadow-card-hover sm:w-[300px]"
    >
      {/* Poster */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={project.poster}
          alt={project.title}
          fill
          sizes="300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {/* Badge */}
        {project.badge && (
          <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            {project.badge}
          </span>
        )}

        {/* Live preview pill (hover) */}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Play className="h-3 w-3 fill-current" />
          Live preview
        </span>

        {/* Title block */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h4 className="text-sm font-bold text-white">{project.title}</h4>
          <p className="line-clamp-1 text-xs text-white/70">{project.tagline}</p>
        </div>
      </div>
    </button>
  );
}

/** Horizontal, scroll-snap row of posters (Netflix row). */
function ProjectRow({
  label,
  items,
  onOpen,
}: {
  label: string;
  items: Project[];
  onOpen: (p: Project) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 px-1 text-[15px] font-bold text-foreground">{label}</h3>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {items.map((p) => (
          <ProjectPoster key={p.id} project={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export function ProjectsFeed() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
  const [menuOpen, setMenuOpen] = useState(false);

  const rows = useMemo(() => {
    const visible = projectCategories.filter((c) => filter === 'All' || filter === c);
    return visible
      .map((c) => ({ label: c, items: projects.filter((p) => p.category === c) }))
      .filter((r) => r.items.length > 0);
  }, [filter]);

  const filterOptions: (ProjectCategory | 'All')[] = ['All', ...projectCategories];

  return (
    <>
      <ProfileCard
        title="My Creations"
        action={
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {filter === 'All' ? 'Filter' : filter}
            </Button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-popover shadow-card-hover"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFilter(opt);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                      filter === opt ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          {rows.map((row) => (
            <ProjectRow key={row.label} label={row.label} items={row.items} onOpen={setSelected} />
          ))}
        </div>
      </ProfileCard>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
