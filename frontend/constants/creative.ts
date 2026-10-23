// constants/creative.ts
// Data source for the Portfolio visual wall (/portfolio).
// Each item renders as a thumbnail in a masonry grid and expands in a lightbox.
// Swap the `image` paths and copy with real creative assets as you produce them.

export type CreativeCategory =
  | "Web Development"
  | "UI/UX"
  | "E-Commerce"
  | "Branding"
  | "Video"
  | "Data";

export type CreativeItem = {
  id: number;
  title: string;
  category: CreativeCategory;
  description: string;
  tags: string[];
  /** Thumbnail image. Optional for Vimeo items — if omitted, the poster is
   *  auto-fetched from the Vimeo thumbnail using `vimeoId`. */
  image?: string;
  /** "image" (default), "video" (local file), or "vimeo" (embed). */
  media?: "image" | "video" | "vimeo";
  /** For video items: path to a local file in public/videos/, e.g. "/videos/reel.mp4". */
  video?: string;
  /** For vimeo items: the numeric video ID from the Vimeo URL (e.g. "123456789"). */
  vimeoId?: string;
  /** For unlisted vimeo videos: the hash after the "?h=" / "/" in the URL. Omit for public videos. */
  vimeoHash?: string;
  /** Video orientation — "portrait" (9:16 vertical) gets a tall player in the
   *  lightbox; defaults to "landscape" (16:9). */
  aspect?: "portrait" | "landscape";
  /** Optional external link shown in the lightbox. */
  href?: string;
  /** Larger tiles span two rows for a more dynamic wall. */
  featured?: boolean;
};

export const CREATIVE_CATEGORIES: ("All" | CreativeCategory)[] = [
  "All",
  "Web Development",
  "UI/UX",
  "E-Commerce",
  "Branding",
  "Video",
  "Data",
];

export const CREATIVE_ITEMS: CreativeItem[] = [
  {
    id: 1,
    title: "Carshey Philippines",
    category: "E-Commerce",
    description:
      "Storefront for automotive parts — catalog, cart, and secure checkout built with Next.js.",
    tags: ["Next.js", "Tailwind CSS", "E-Commerce"],
    image: "/images/projects/carshey.png",
    href: "https://carsheyph.vercel.app/",
    featured: true,
  },
  {
    id: 2,
    title: "Lazapee E-Commerce",
    category: "E-Commerce",
    description:
      "Full shopping platform with advanced search, responsive layout, and a fast cart system.",
    tags: ["Next.js", "TypeScript", "UI/UX"],
    image: "/images/projects/lazapee.png",
    href: "https://lazapee-mauve.vercel.app/",
  },
  {
    id: 3,
    title: "Vendo POS",
    category: "Web Development",
    description:
      "Point-of-sale interface concept with inventory tracking and a clean transaction flow.",
    tags: ["React", "POS", "Dashboard"],
    image: "/images/projects/vendopos.jpeg",
  },
  {
    id: 4,
    title: "Carshey — Product Detail",
    category: "UI/UX",
    description:
      "Product page layout exploration focusing on imagery, specs, and add-to-cart hierarchy.",
    tags: ["Figma", "UI/UX", "Layout"],
    image: "/images/projects/carshey.jpeg",
  },
  {
    id: 5,
    title: "Lazapee — Landing Concept",
    category: "UI/UX",
    description:
      "Hero and category grid concept emphasizing promotions and quick discovery.",
    tags: ["Landing Page", "UI/UX"],
    image: "/images/projects/lazapee.jpeg",
  },
  {
    id: 6,
    title: "Data Scraper Insights",
    category: "Data",
    description:
      "Facebook engagement analysis (likes, shares, comments) feeding marketing-campaign insights.",
    tags: ["Data", "Analytics", "Research"],
    image: "/images/experience/data-scraper.png",
  },
  {
    id: 7,
    title: "Profile Branding",
    category: "Branding",
    description:
      "Personal brand photography and identity direction used across the portfolio.",
    tags: ["Branding", "Identity"],
    image: "/images/profile-about.jpg",
    featured: true,
  },
  {
    id: 8,
    title: "Architectural Backdrop",
    category: "Branding",
    description:
      "Background art direction — texture and tone used for section headers.",
    tags: ["Art Direction", "Visual"],
    image: "/images/building-bg.jpg",
  },
  // ── YOUR VIMEO VIDEOS ──────────────────────────────────────────
  // All 6 videos from your Vimeo Library, with real IDs wired in.
  // Posters are auto-fetched from each video's Vimeo thumbnail — no `image`
  // needed. (To override a poster, add image: "/images/your-file.jpg".)
  // They're public (🌐), so no vimeoHash is needed.
  {
    id: 9,
    title: "CPC LMS — Commercial",
    category: "Video",
    description:
      "Commercial spot for the CPC Learning Management System — feature-led edit cut to music.",
    tags: ["Video Editing", "Commercial", "Promo"],
    media: "vimeo",
    vimeoId: "1238907693",
    featured: true,
  },
  {
    id: 10,
    title: "DriveTrack",
    category: "Video",
    description:
      "Product edit for DriveTrack — walkthrough with motion graphics and on-screen callouts.",
    tags: ["Video Editing", "Product", "Motion Graphics"],
    media: "vimeo",
    vimeoId: "1238907496",
  },
  {
    id: 11,
    title: "How They Made 30% Legal",
    category: "Video",
    description:
      "Explainer edit — hook-driven cuts with on-screen captions and motion text.",
    tags: ["Video Editing", "Explainer", "Captions"],
    media: "vimeo",
    vimeoId: "1238907116",
    aspect: "portrait",
    featured: true,
  },
  {
    id: 12,
    title: "Color Grade Reel",
    category: "Video",
    description:
      "Color grading showcase — before/after looks and cinematic tone work.",
    tags: ["Color Grade", "DaVinci Resolve", "Cinematic"],
    media: "vimeo",
    vimeoId: "1238906360",
    aspect: "portrait",
  },
  {
    id: 13,
    title: "VendoPOS Promo",
    category: "Video",
    description:
      "Product promo for the VendoPOS system — feature highlights cut to music.",
    tags: ["Video Editing", "Promo", "Product"],
    media: "vimeo",
    vimeoId: "1238906199",
  },
  {
    id: 14,
    title: "Zone de Rassemblement — Promo",
    category: "Video",
    description:
      "Event/brand promo edit — paced sequence with graphics and sound design.",
    tags: ["Video Editing", "Promo", "Event"],
    media: "vimeo",
    vimeoId: "1238906125",
  },
];

/**
 * Poster/thumbnail URL for a creative item.
 * - Uses the explicit `image` when one is set.
 * - For Vimeo items without an image, the poster is auto-fetched straight from
 *   the video's Vimeo thumbnail (via vumbnail.com) using `vimeoId` — so new
 *   videos just need a `vimeoId` and the still appears automatically.
 */
export function creativePoster(item: CreativeItem): string {
  if (item.image) return item.image;
  if (item.vimeoId) return `https://vumbnail.com/${item.vimeoId}.jpg`;
  return "";
}
