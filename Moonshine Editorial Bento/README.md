# Moonshine Capital — Editorial Bento Marketing Site (Next.js SSG)

## Stack
- Next.js (App Router) in **static export** mode
- Tailwind CSS
- Repo-local JSON content in `/data`

## Run locally
```bash
npm install
npm run dev
```

## Build (static export)
```bash
npm run build
```
Output is generated into `out/` (static HTML/CSS/JS).

## Deploy to Vercel (GitHub → Vercel)
1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Framework preset: **Next.js** (Vercel detects it).
4. Build command: `next build` (default)
5. Output directory: leave default (Vercel handles Next export).
6. Deploy.

## Where to edit content
- Brand + meta: `data/site.json`
- Services grid: `data/services.json`
- Insights (blog): `data/posts.json`
- Case studies: `data/caseStudies.json`
- Trust signals: `data/trust.json`
- Partner program: `data/partnerProgram.json`
- Hero metrics: `data/metrics.json`

## Replace imagery (recommended)
The hero image block uses a gradient placeholder to stay export-safe and lightweight.
- Add images to `public/images/` and swap the hero image block in:
  - `components/sections/bento-hero.tsx`

## SEO & performance checklist
- [ ] Update `data/site.json.url` to your production domain (important for canonical + sitemap).
- [ ] Replace `/public/og/og.svg` with a branded OG image.
- [ ] Ensure page titles/descriptions reflect real offerings.
- [ ] Add real legal/compliance copy in `/app/legal/page.tsx`.
- [ ] Use compressed images (AVIF/WebP) if you add photos.
- [ ] Keep embeds privacy-friendly (use youtube-nocookie when possible).

## Troubleshooting
- **Trailing slashes**: This repo uses `trailingSlash: true` so links include `/path/`. Keep internal links ending with `/`.
- **Static export constraints**: Avoid server actions, databases, and runtime APIs. Use local JSON + `generateStaticParams`.
- **Video embed blocked**: Replace iframe `src` with your own privacy-safe embed URL.
