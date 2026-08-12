# Avia Konfino — portfolio

A dark, cinematic portfolio presenting five shipped AI products: a voice sales
agent on a real phone line, a computer-vision poker settlement app, an AI job
matching platform, a production Instagram automation, and a zero-dependency
desktop agent.

Live: https://avia-konfino.vercel.app

## Stack

Next.js 16 (App Router, fully static) · React 19 · TypeScript · Tailwind CSS v4 ·
Motion. No server code — every route is prerendered at build time.

## Running it

```bash
npm install
npm run dev
```

## Where the content lives

All copy, links and media references are in typed data files, so editing the
site never means editing a component:

- `src/data/projects.ts` — the five case studies
- `src/data/skills.ts` — capability groups and the tool marquee
- `src/data/site.ts` — name, headline, contact details, SEO strings

## Scripts

These are build-time utilities, not part of the deployed site.

| Script | What it does |
| --- | --- |
| `node scripts/media.mjs probe` | Reports duration and resolution of the source commercial |
| `node scripts/media.mjs build` | Writes the preview loop, poster and 720p cut into `public/media` |
| `node scripts/contact-sheet.mjs <dir> <seconds>` | Samples frames so a preview window can be chosen by eye |
| `node scripts/capture-candidates.mjs [slug]` | Screenshots the live project sites into `public/screenshots/candidates` |
| `node scripts/capture-poker.mjs` | Plays a whole four player game against the live app to photograph the lobby, table and settlement |
| `node scripts/capture-jobscout.mjs` | Drives a local JobScout instance through onboarding and prints the candidate URL |
| `node scripts/capture-jobscout-scoreboard.mjs <candidate url>` | Screenshots the scoreboard and the ranked match list from a scanned candidate |
| `node scripts/optimize-shots.mjs` | Turns chosen candidates into the webp finals the site ships |
| `node scripts/shoot.mjs <url> <out> [--full --sweep]` | General-purpose screenshot helper |
| `node scripts/smoke.mjs [baseUrl]` | Checks every route renders and every external link resolves |

`public/screenshots/candidates/` is gitignored — only the chosen, cropped finals
are published.

## Media

The source commercial is 77 MB at 1080p and is never shipped. The pipeline
produces a 1.3 MB silent loop for the flagship card and a 6 MB 720p cut that is
click-to-play with `preload="none"`, so nothing downloads unless a visitor asks
for it.
