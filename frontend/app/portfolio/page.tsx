'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Sparkles, Play, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { cn } from '@/lib/utils';
import {
  CREATIVE_ITEMS,
  creativePoster,
  type CreativeItem,
} from '@/constants/creative';

/**
 * Renders a poster image. Local paths use next/image; auto-fetched remote
 * Vimeo thumbnails (https://…) use a plain <img> so no image-domain config
 * is required (all images are unoptimized project-wide anyway).
 */
function PosterImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  if (src.startsWith('http')) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

// A single tile in the masonry wall. Images render statically; videos show
// their poster and autoplay muted on hover (full sound opens in the lightbox).
function GalleryTile({
  item,
  onOpen,
}: {
  item: CreativeItem;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = item.media === 'video' && !!item.video;
  const isVimeo = item.media === 'vimeo' && !!item.vimeoId;
  const hasPlay = isVideo || isVimeo;
  const poster = creativePoster(item);

  const handleEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={onOpen}
      onMouseEnter={isVideo ? handleEnter : undefined}
      onMouseLeave={isVideo ? handleLeave : undefined}
      className="group relative block w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
      {/* Uniform 16:9 tiles for a clean, consistent wall. Portrait clips are
          center-cropped here; their true aspect is restored in the lightbox. */}
      <div className="relative w-full aspect-video">
        {isVideo ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PosterImage
            src={poster}
            alt={item.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Play badge for videos (hidden while hovering so the local clip is visible) */}
        {hasPlay && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
            <span className="rounded-full bg-black/55 p-4 text-white backdrop-blur-sm">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Badge
            variant="secondary"
            className="mb-2 w-fit bg-white/15 text-white backdrop-blur-sm"
          >
            {item.category}
          </Badge>
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <p className="line-clamp-2 text-sm text-white/80">
            {item.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function CreativePage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Video-only for now (local files + Vimeo). The static-gallery items still
  // live in constants/creative.ts — just re-add a filter here to show them.
  const filteredItems = useMemo(
    () =>
      CREATIVE_ITEMS.filter(
        (item) => item.media === 'video' || item.media === 'vimeo',
      ),
    [],
  );

  const activeItem: CreativeItem | null =
    activeIndex !== null ? filteredItems[activeIndex] ?? null : null;

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const showNext = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? i : (i + 1) % filteredItems.length,
    );
  }, [filteredItems.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? i : (i - 1 + filteredItems.length) % filteredItems.length,
    );
  }, [filteredItems.length]);

  // Keyboard controls + lock body scroll while the lightbox is open.
  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, closeLightbox, showNext, showPrev]);

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* HEADER */}
        <div className="max-w-3xl mb-10">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to profile
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Editing reel
          </h1>
          <p className="text-lg text-muted-foreground">
            Short-form edits, color grades, and promos. Hover to preview, then
            click any piece to watch it in full.
          </p>
        </div>

        {/* MASONRY WALL */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <GalleryTile
                key={item.id}
                item={item}
                onOpen={() => setActiveIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No videos yet — check back soon.
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev / Next */}
            {filteredItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Content card */}
            <motion.div
              key={activeItem.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'flex max-h-[95vh] w-full flex-col overflow-hidden rounded-2xl bg-card shadow-2xl md:h-[90vh] md:flex-row',
                activeItem.aspect === 'portrait' ? 'max-w-4xl' : 'max-w-[1600px]',
              )}
            >
              {/* Media stage — fills the available space; the inner box keeps the
                  video's true aspect so portrait clips get a tall player. */}
              <div className="flex min-h-[45vh] flex-1 items-center justify-center bg-black md:min-h-0">
                <div
                  className={cn(
                    'relative mx-auto',
                    activeItem.aspect === 'portrait'
                      ? 'h-[45vh] aspect-[9/16] md:h-full'
                      : 'aspect-video w-full max-h-full',
                  )}
                >
                  {activeItem.media === 'vimeo' && activeItem.vimeoId ? (
                    <iframe
                      key={activeItem.vimeoId}
                      src={`https://player.vimeo.com/video/${activeItem.vimeoId}${
                        activeItem.vimeoHash ? `?h=${activeItem.vimeoHash}&` : '?'
                      }autoplay=1&title=0&byline=0&portrait=0`}
                      title={activeItem.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : activeItem.media === 'video' && activeItem.video ? (
                    <video
                      key={activeItem.video}
                      src={activeItem.video}
                      poster={creativePoster(activeItem)}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <PosterImage
                      src={creativePoster(activeItem)}
                      alt={activeItem.title}
                      sizes="(max-width: 768px) 100vw, 70vw"
                    />
                  )}
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col overflow-y-auto p-6 md:w-[340px]">
                <Badge variant="secondary" className="mb-3 w-fit">
                  {activeItem.category}
                </Badge>
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                  {activeItem.title}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {activeItem.description}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {activeItem.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {activeItem.href && (
                  <Button asChild className="w-full">
                    <Link
                      href={activeItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live
                    </Link>
                  </Button>
                )}

                <EngagementBar
                  targetType="portfolio"
                  targetId={String(activeItem.id)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
