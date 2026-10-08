export type ProjectCategory = 'Featured' | 'Experiments';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  stack: string[];
  poster: string;
  liveUrl: string;
  repoUrl?: string;
  /** Whether the live site allows being shown inside an <iframe>. */
  embeddable: boolean;
  /** Small corner badge, e.g. "Latest". */
  badge?: string;
}

/**
 * Single source of truth for the Netflix-style project rows.
 * Add a new project = append one object here. `embeddable` is verified from the
 * site's X-Frame-Options / CSP frame-ancestors headers (false => poster + open-live
 * fallback instead of a blank iframe).
 */
export const projects: Project[] = [
  {
    id: 'vendopos',
    title: 'VendoPOS',
    tagline: 'POS + ERP for Philippine businesses',
    description:
      'One platform to run a whole business — sales, stock, suppliers, finances and staff in a single system, designed for how Filipino coffee shops, restaurants and retailers actually operate. BIR-ready receipts and GCash / Maya / QRPH payments.',
    category: 'Featured',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'ERP', 'POS'],
    poster: '/images/projects/vendopos.jpeg',
    liveUrl: 'https://vendopos.shop/',
    embeddable: false, // X-Frame-Options: SAMEORIGIN + CSP frame-ancestors 'self'
    badge: 'Latest',
  },
  {
    id: 'carshey',
    title: 'Carshey Philippines',
    tagline: 'Rent-to-own car marketplace',
    description:
      'A rent-to-own vehicle marketplace with catalog, financing flows, quick approval and same-day release — browse cars across brands in a dark, cinematic storefront.',
    category: 'Featured',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'E-Commerce'],
    poster: '/images/projects/carshey.jpeg',
    liveUrl: 'https://carsheyph.vercel.app/',
    embeddable: true,
  },
  {
    id: 'lazapee',
    title: 'Lazapee',
    tagline: 'Full-featured e-commerce storefront',
    description:
      'An online shopping destination with search, category filters, price-range control, a cart system and a responsive product grid across 95+ products.',
    category: 'Featured',
    stack: ['Next.js', 'TypeScript', 'E-Commerce', 'UI/UX'],
    poster: '/images/projects/lazapee.jpeg',
    liveUrl: 'https://lazapee-mauve.vercel.app/',
    embeddable: true,
  },

  // ── Add your other recent projects below (one object each) ──────────────
  // {
  //   id: 'your-project',
  //   title: 'Project Name',
  //   tagline: 'One-line summary',
  //   description: 'What it does and the stack highlights.',
  //   category: 'Experiments',
  //   stack: ['Next.js', 'React'],
  //   poster: '/images/projects/your-project.jpeg',
  //   liveUrl: 'https://your-project.example.com/',
  //   repoUrl: 'https://github.com/emciiowhy/your-project',
  //   embeddable: true,
  // },
];

export const projectCategories: ProjectCategory[] = ['Featured', 'Experiments'];
