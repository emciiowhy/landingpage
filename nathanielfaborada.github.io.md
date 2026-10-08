# Design Map

> Source: https://nathanielfaborada.github.io/
> Concept: A developer portfolio built as a pixel-faithful **Facebook profile clone** — cover photo + circular avatar, Intro/Work/Skills/Education/Social/Collaborators sidebar cards, and projects rendered as feed posts.

## Spacing Scale
4px base · 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24px · section gap fixed 16px · grid gutter 16px

## Font Hierarchy
- Name/H1 — 24px / 700 / Segoe UI
- Card title — 17.6px / 700
- Body — 15px / 400 · Body-strong — 15px / 600
- Meta & labels — 13.12px / 600
- Button — 12.8px / 600 · Timestamp — 11.52px / 400
- Dominant weight: **600**

## Color Palette
- Background `#F0F2F5` · Card `#FFFFFF` · Border/pill `#E4E6EB`
- Text primary `#050505` · secondary `#65676B` · heading `#1C1E21`
- Accent `#1877F2` (only saturated hue; links, Resume/Visit buttons, active-tab underline)

## Image Ratios
- Cover banner 8.68:1 · Post screenshot ~2.08:1 · Carousel frame 1.78:1 · Avatar 1:1

## Component Tokens
- Radius: 6px (buttons/pills) · 10px (carousel) · 12px (cards) · 50% (avatars)
- Shadow: `0 2px 12px rgba(0,0,0,0.08)` cards · `0 4px 12px rgba(0,0,0,0.15)` avatar (single-layer, pure black)
- Grid: 2 cols, `360px 842px`, 16px gutter, ~1218px total
- Motion: `background`/`color` 0.15–0.2s ease-in-out · no `:focus-visible` · no reduced-motion

---

# Taste DNA

### Borrowed Interface
- **Trigger**: When deciding how a hiring manager should navigate an unknown developer's work.
- **Decision**: Cloned Facebook's profile shell as the portfolio layout **over** inventing an original one.
- **Reason**: Recognition beats comprehension — visitors spend zero attention learning the layout and all of it on the work; the familiarity also reads as wit in a stack of generic portfolios.
- **Evidence**: `#F0F2F5` canvas, `#1877F2` accent, Segoe UI (466×), `360px 842px` feed grid, friends-list "Collaborators" card with Followers/Following + "Visit".

### Projects-as-Posts
- **Trigger**: When presenting each project's title, blurb, stack, and screenshot.
- **Decision**: Framed each project as a social feed post **over** a static project card or case-study page.
- **Reason**: A feed invites frictionless scrolling, so more projects get viewed than a gallery of equal tiles delivers.
- **Evidence**: author row + verified check, date badge (Apr 2026 / Sep 2024), hashtag tech pills (`#javascript #supabase`), 1.78:1 carousel with "1/2" counter, Source/Visit/star action row.

### Weight Over Size
- **Trigger**: When establishing hierarchy on a page holding many projects, skills, and bio blocks at once.
- **Decision**: Drove emphasis with font-weight (600/700) and a compressed type scale **over** a tall 40px+ display scale.
- **Reason**: A profile reads as information, not a pitch — big headings would waste the vertical space the feed needs and break the "real account" illusion.
- **Evidence**: weight 600 (87×) vs 400 (45×), sizes clustered 11.5–17.6px, only one 24px element, 16px section gaps.

### System-Font, No Web Font (restraint)
- **Trigger**: When choosing typography for a site whose whole premise is mimicry.
- **Decision**: Shipped native Segoe UI + Arial fallback and loaded **no** brand/display webfont — rejecting the usual portfolio characterful typeface.
- **Reason**: The authenticity of the Facebook impression depends on Facebook's actual font — a designed typeface would announce "crafted website" and puncture the illusion.
- **Evidence**: `uniqueFamilies` = Segoe UI (466) + Arial (11) only, no `@font-face` payload, system-native weights 400/500/600/700.
