# Portfolio Codebase Overview

> Reference doc for the `my-portfolio` monorepo, written 2026-10-08.
> Intended as context for planning the portfolio upgrade (e.g. feeding into the `grill-with-docs` / `grilling` skills).
> This documents the codebase **as it currently is** — including rough edges — not the ideal end state.

---

## 1. What this is

A personal portfolio site for **Mc Zaldy Yap** (Software Developer, Cebu, Philippines). It is a two-part monorepo:

- **`frontend/`** — a Next.js 16 (App Router) + React 19 site, deployed to Vercel (`mczaldy.vercel.app`).
- **`backend/`** — an Express + TypeScript API whose only job today is the contact form: it stores submissions in Neon Postgres (via Drizzle ORM), emails them via Gmail SMTP, and optionally forwards to a Make.com webhook. Deployed to Render (`my-portfolio-backend-rv94.onrender.com`).

The two halves are **independent apps with their own `package.json`**, wired together only by an HTTP call from the contact page to the backend.

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Frontend framework | Next.js `^16.0.7` (App Router, Turbopack), React `^19.2.1` |
| Language | TypeScript (both apps) |
| Styling | Tailwind CSS v3 (`^3.4.1`) + `tailwindcss-animate`, CSS variables for theming |
| UI components | shadcn/ui-style primitives in `components/ui/` (Radix UI under the hood) |
| Icons | `lucide-react` |
| Animation | `framer-motion` (`^12`) |
| Theming | `next-themes` (light/dark/system, class strategy) |
| Fonts | `next/font/google` — Geist Sans + Geist Mono |
| Backend framework | Express `^4.18` on Node, run with `tsx` / `nodemon` in dev |
| ORM | Drizzle ORM (`drizzle-orm/neon-http`) + `drizzle-kit` |
| Database | Neon serverless Postgres |
| Email | `nodemailer` via Gmail SMTP (root `package.json` also lists `resend`) |
| Analytics / ads | `@vercel/speed-insights`, Google AdSense script in root layout |

---

## 3. Repository layout

```
my-portfolio/
├── package.json            # root: backend dev/build scripts + drizzle-kit (NOTE: deps here are backend's)
├── drizzle.config.ts       # points drizzle-kit at backend schema
├── .env                    # root env (open in IDE — contains secrets)
├── backend/
│   ├── package.json        # backend's own deps
│   ├── tsconfig.json
│   ├── drizzle/            # generated SQL migrations + meta snapshots
│   └── src/
│       ├── server.ts       # Express app: CORS, JSON, routes, health check
│       ├── config/db.ts    # pg Pool (SEEMS UNUSED — see §7)
│       ├── db/
│       │   ├── index.ts    # Neon + Drizzle client (the one actually used)
│       │   └── schema.ts   # contact_messages + legacy contacts tables
│       └── routes/
│           └── contact.ts  # POST /api/contact
└── frontend/
    ├── package.json
    ├── next.config.ts      # Turbopack root + env preload
    ├── next.config.mjs      # distDir, ignoreBuildErrors, unoptimized images (TWO configs — see §7)
    ├── postcss.config.js / postcss.config.mjs   # also duplicated
    ├── tailwind.config.ts
    ├── app/                # App Router pages
    ├── components/
    │   ├── ui/             # shadcn primitives (button, card, badge, input, textarea, dropdown-menu)
    │   ├── common/         # Header, Footer, Section, SectionHeading, ProjectCard, RevealOnScroll, ThemeToggle
    │   ├── features/home/  # BentoGrid, HomeBanner, Project, Skills, Contact
    │   ├── provider/       # theme-provider
    │   ├── footer.tsx       # DEAD DUPLICATE — not imported (see §7)
    │   └── navigation.tsx   # DEAD DUPLICATE — not imported (see §7)
    ├── constants/          # project.ts, skill.ts, blog.ts (static content/data)
    ├── lib/utils.ts        # cn() helper
    └── public/images/      # profile, experience, project, icon images + resume.pdf
```

---

## 4. Frontend routes (App Router)

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home. `'use client'`. Hero + BentoGrid + Recent Experience + Featured Projects + CTA. Experience/project data is **hardcoded inline** in the component, not from `constants/`. |
| `/about` | `app/about/page.tsx` | Server component. Bio, work experience timeline, tech-stack badges, contact info. |
| `/projects` | `app/projects/page.tsx` | `'use client'`. Searchable/filterable list; experiences hardcoded in `ALL_EXPERIENCES`. |
| `/contact` | `app/contact/page.tsx` | `'use client'`. Form → POSTs to backend `/api/contact`. Toast + inline status. |
| `/pricing` | `app/pricing/page.tsx` | Server component. Free / Standard / (more) plans in PHP. |
| `/faq` | `app/faq/page.tsx` | Server component. Static Q&A array. |
| `/blog` | `app/blog/page.tsx` | `'use client'`. Lists `BLOG_POSTS` from `constants/blog.ts`. |
| `/blog/[...post]` | `app/blog/[...post]/page.tsx` | Single post (catch-all) + `not-found.tsx`. |
| `/blog/category/[[...category]]` | optional catch-all | Category filtering. |

Root layout (`app/layout.tsx`) wraps everything in `ThemeProvider` + `Header` + `Footer`, injects Google AdSense, and sets global metadata/SEO.

---

## 5. Content / data model (frontend)

Static content lives in `constants/` and inline arrays — there is **no CMS and the backend does not serve content**.

- `constants/project.ts` — `PROJECTS[]`: **placeholder data** ("Project Alpha/Beta/Gamma/Delta") pointing at `/media/hero-bannerimg.avif` (a path that may not exist under `public/`). The real projects (Carshey, Lazapee) are hardcoded separately inside `app/page.tsx` and `app/projects/page.tsx`.
- `constants/skill.ts` — `SKILLS[]`: Frontend / Backend / Tools groupings.
- `constants/blog.ts` — typed `BlogPost` / `BlogCategory` + `BLOG_POSTS[]` (mostly Lorem Ipsum, authors are placeholder names) and a `BLOG_CATEGORIES[]` tree with parent/child.

**Implication for the upgrade:** content is scattered across inline arrays and `constants/`. Consolidating to a single source (typed constants or a CMS/MDX) is a likely early decision.

---

## 6. Backend API

Single meaningful endpoint plus health/root:

- **`POST /api/contact`** (`routes/contact.ts`)
  1. Validates `firstName`, `lastName`, `email`, `message` (required); `phone`, `company` optional.
  2. Inserts into `contact_messages` via Drizzle.
  3. Fire-and-forget POST to `MAKE_WEBHOOK_URL` (if set) for "AI lead qualification".
  4. Fire-and-forget Gmail SMTP: admin notification + auto-reply to the sender.
  5. Returns `{ success, message, data }`.
- **`GET /api/health`** — runs `SELECT NOW()` against Neon, returns status.
- **`GET /`** — HTML "Backend Running" banner.
- **404 handler** returns JSON.

**CORS**: allow-list built from `FRONTEND_URL` + `mczaldy.vercel.app` + `localhost:3000`, matched by `startsWith`.

**Database schema** (`db/schema.ts`):
- `contact_messages` — `id, first_name, last_name, email, message, created_at`. **This is the active table.**
- `contacts` — legacy table, still defined and migrated but no longer used by the API.
- Drizzle infers `ContactMessage` / `ContactMessageRecord` (and legacy equivalents) types.

**Frontend→backend contract note:** the contact form sends `name`, `firstName`, `lastName`, `email`, `phone`, `company`, `message`; the backend only persists `firstName/lastName/email/message` (phone/company go to the webhook/email only, and `name` is recomputed server-side).

---

## 7. Known rough edges / tech debt

These are observations, not yet decisions — good candidates to resolve during the upgrade.

1. **🔴 Hardcoded secrets in source.** `backend/src/routes/contact.ts` has a Gmail address and **app password as literal fallback values** (`pass: process.env.GMAIL_APP_PASSWORD || 'kncoorrokjochxuc'`), and a default admin email. This is a live credential checked into code — it should be rotated and moved to env-only, never committed.
2. **Two DB setups in the backend.** `config/db.ts` creates a node-`pg` `Pool`, while `db/index.ts` creates the Neon-HTTP Drizzle client. Only the Drizzle client is imported by the app; the `pg` Pool appears unused. (`pg` may not even be a declared dependency.)
3. **Duplicate / dead frontend components.** `components/footer.tsx` and `components/navigation.tsx` are **not imported anywhere** — the layout uses `components/common/Footer.tsx` and `components/common/Header.tsx`. Safe-to-delete candidates.
4. **Duplicate Next.js config.** Both `next.config.ts` and `next.config.mjs` exist. Next will load only one (`.ts` is preferred in Next 16); the `.mjs` one (which sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`) may be silently ignored — worth confirming which actually applies.
5. **Duplicate PostCSS config** (`postcss.config.js` + `postcss.config.mjs`) and **duplicate global CSS** (`app/globals.css` + `styles/globals.css`).
6. **`ignoreBuildErrors` / `unoptimized images`.** If `next.config.mjs` is the active one, type errors are suppressed at build and Next image optimization is off — both hide problems and hurt performance.
7. **Placeholder content shipped.** `constants/project.ts` and `constants/blog.ts` contain demo/Lorem data and placeholder author names; `/media/hero-bannerimg.avif` referenced by `PROJECTS` likely 404s.
8. **Hardcoded backend URL** in `app/contact/page.tsx` (`https://my-portfolio-backend-rv94.onrender.com`) rather than an env var — chosen by `NODE_ENV`.
9. **Root `package.json` naming.** Root declares `name: "my-portfolio"` but its dependencies are the backend's (express, drizzle, etc.), and its scripts run the backend + `drizzle-kit`. The real backend also has its own `package.json`. The ownership of deps between root and `backend/` is muddled.
10. **Header nav not responsive.** `common/Header.tsx` renders a fixed horizontal `<ul>` with no mobile/hamburger handling and uses `border-gray-800` (a hardcoded color rather than a theme token).

---

## 8. How to run

From the repo root:

```bash
# Backend (Express on :5000) — uses root package.json scripts
npm run dev:backend        # nodemon + tsx backend/src/server.ts
# or everything together
npm run dev                # concurrently backend + frontend

# Frontend (Next.js on :3000)
cd frontend && npm run dev

# Database (Drizzle, from root)
npm run db:generate        # generate migration from schema
npm run db:push            # push schema to Neon
npm run db:studio          # Drizzle Studio
```

Required env (not committed): `DATABASE_URL` (Neon), `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EMAIL_TO`, optional `MAKE_WEBHOOK_URL`, `FRONTEND_URL`, `PORT`. Frontend relies on `NODE_ENV` to pick the backend URL.

---

## 9. Likely upgrade themes (open questions for grilling)

Not decisions — prompts for the `grill-with-docs` session:

- **Design direction:** keep the current Geist + shadcn minimal look, or push toward a more distinctive portfolio aesthetic? (The `design-taste-frontend` skill is installed for this.)
- **Content source of truth:** consolidate inline arrays + `constants/` into one typed layer, or move to MDX/CMS for blog + projects?
- **Do we still need the Express backend?** The only job is the contact form — could become a Next.js Route Handler / Server Action + Resend, dropping the separate Render service entirely.
- **Secret hygiene:** rotate the leaked Gmail app password; enforce env-only config.
- **Cleanup pass:** delete dead components, de-duplicate the config files, decide the real build settings (type-checking on? image optimization on?).
- **Responsive + a11y:** mobile nav, theme-token colors, contrast, motion-reduced fallbacks.
- **Real project/blog content** to replace placeholders.
