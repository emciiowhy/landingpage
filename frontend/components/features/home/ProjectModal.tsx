'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Loader2, MonitorPlay, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Netflix "detail" modal. For embeddable sites it loads a live <iframe>; for
 * sites that block framing it shows the poster + an "Open live" fallback so the
 * panel is never a blank white box.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset the loading state whenever a new project opens.
  useEffect(() => {
    setIframeLoaded(false);
  }, [project?.id]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card-hover"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-primary"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Preview surface (16:9) */}
            <div className="relative aspect-video w-full shrink-0 bg-black">
              {project.embeddable ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                  )}
                  <iframe
                    src={project.liveUrl}
                    title={`${project.title} live preview`}
                    className="h-full w-full"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onLoad={() => setIframeLoaded(true)}
                  />
                </>
              ) : (
                <>
                  <Image
                    src={project.poster}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white/90">
                      <Lock className="h-3.5 w-3.5" />
                      This site blocks embedding — open it live below
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.tagline}</p>
                </div>
                <div className="flex gap-2">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Live
                    </Button>
                  </a>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" className="gap-2">
                        <Github className="h-4 w-4" />
                        Source
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.embeddable && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  <MonitorPlay className="h-3.5 w-3.5" />
                  Live, interactive preview — scroll and click inside the frame above.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
