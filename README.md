# Adobo Guild — Where Winds Meet

Community site for the **Adobo Guild** (Where Winds Meet). Migrated from a static
HTML/CSS/JS site to Next.js with a pixel-faithful port of the original design.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static prerender)
- React 19 + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui primitives (Radix Dialog & Tabs, restyled with the original Adobo CSS)
- Prettier + ESLint (flat config) + Husky/lint-staged

## Commands

```bash
npm install        # install
npm run dev        # dev server → http://localhost:3000
npm run build      # production build (static export → out/)
npm run preview    # serve out/ AT /Project-Adobo-Website/ (accurate GH Pages test)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier (write)
npm run check-assets     # fail if any referenced image/audio variant is missing
npm run test:e2e         # Playwright smoke tests (run `npm run build` first)
npm run convert-images   # regenerate responsive WebP variants (sharp)
npm run generate-og-image # regenerate public/images/og-card.jpg
```

## Workflows

- **CI** (`.github/workflows/ci.yml`) — prettier/eslint/typecheck + asset check + build on every push/PR to master
- **Deploy** (`.github/workflows/deploy.yml`) — builds and publishes `out/` to GitHub Pages on master pushes (enable Pages → Source: "GitHub Actions", once)

## Project structure

```
public/
  images/           # all site imagery (originals + pre-generated WebP srcsets)
  audio/            # background.mp3
  manifest.json     # PWA manifest (path preserved from original site)
src/
  app/
    layout.tsx      # metadata/SEO, header/footer, client islands
    page.tsx        # single-page composition (matches original section order)
    globals.css     # design tokens + consolidated site styles
    icon.png        # favicon (generated from logo)
  components/
    ui/             # shadcn/ui primitives (dialog, tabs)
    sections/       # hero, intro splits, activities, benefits, philosophy,
                    # roster, contact CTA
    ...             # header, footer, member card, lightbox, music toggle,
                    # scroll reveal, smooth anchors, contact dialog
  lib/
    members.ts      # guild roster data + typed helpers (ported verbatim)
    utils.ts        # cn() class merge helper
scripts/
  convert-images.js # sharp-based WebP generator (kept from the legacy stack)
```

## Architecture notes

- **Server Components by default.** Client components exist only for interactivity:
  header menu, roster tabs/search/pagination, flip cards, lightbox, contact modal,
  background-music toggle, scroll-reveal and smooth-scroll islands.
- **CSS fidelity:** the original three-layer cascade (`critical-css` → `style.css`
  → inline overrides) was merged into `globals.css` using the _effective_ winning
  declarations; class names are preserved 1:1 so JSX mirrors the original DOM.
- **Images** intentionally use plain `<picture>`/`<img>` with the original
  pre-generated WebP `srcset` chains instead of `next/image` — assets are already
  optimally sized, and this preserves exact layout/loading behavior.
- **shadcn/ui is used only where it adds accessibility** without changing looks:
  Radix Dialog (contact-leader modal: focus trap/Esc/backdrop) and Radix Tabs
  (roster), both restyled with the original classes.

## Adding content

- **Roster changes:** edit `GUILD_MEMBERS` in `src/lib/members.ts`. Photos go in
  `public/images/members/`; set `webp: false` if no responsive WebP variants exist.
- **New sections:** add a server component in `src/components/sections/` and mount
  it in `src/app/page.tsx`. Add `data-animate` to opt into the scroll-reveal.
- **New styles:** prefer extending `globals.css` tokens/classes so the visual
  language stays consistent.

## Deployment (GitHub Pages)

The site exports statically to `out/` for GitHub Pages (project site):

```bash
npm run build      # generates out/ with /Project-Adobo-Website base path
npm run preview    # serves out/ AT the base path (accurate local test of GH Pages)
```

- Production URL: `https://foobu.github.io/Project-Adobo-Website/`
- `npm run preview` mounts `out/` under `/Project-Adobo-Website/` exactly like
  GitHub Pages, so all asset URLs resolve locally. Serving `out/` at `/` with a
  plain static server will show unstyled HTML — that is expected with a base
  path, not a bug.
- `NEXT_PUBLIC_SITE_URL` can override the canonical/OG origin if the account
  name differs.
