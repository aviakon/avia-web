/**
 * Collects candidate screenshots from the live project sites so the best ones
 * can be picked by hand. Output lands in public/screenshots/candidates/<slug>/
 * which is gitignored — only the chosen finals are committed.
 *
 *   node scripts/capture-candidates.mjs [slug ...]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/screenshots/candidates");

const TARGETS = [
  {
    slug: "automa",
    url: "https://driveautoma.vercel.app",
    shots: [
      { name: "hero", scroll: 0 },
      { name: "brain", scroll: 0.18 },
      { name: "diagnostics", scroll: 0.42 },
      { name: "interface", scroll: 0.62 },
      { name: "agent", scroll: 0.8 },
      { name: "cta", scroll: 0.95 },
    ],
  },
  {
    slug: "poker-splitter",
    url: "https://poker-splitter.web.app",
    shots: [
      { name: "landing", scroll: 0 },
      { name: "mid", scroll: 0.4 },
    ],
    alsoMobile: true,
  },
];

const slugFilter = process.argv.slice(2);
const targets = slugFilter.length
  ? TARGETS.filter((target) => slugFilter.includes(target.slug))
  : TARGETS;

const browser = await chromium.launch();

for (const target of targets) {
  const dir = path.join(OUT, target.slug);
  await mkdir(dir, { recursive: true });

  for (const viewport of [
    { label: "desktop", width: 1600, height: 1000, scale: 2 },
    ...(target.alsoMobile
      ? [{ label: "mobile", width: 390, height: 844, scale: 3 }]
      : []),
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      colorScheme: "dark",
      isMobile: viewport.label === "mobile",
      hasTouch: viewport.label === "mobile",
    });
    const page = await context.newPage();

    console.log(`\n${target.slug} · ${viewport.label} · ${target.url}`);
    try {
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 90000 });
    } catch {
      await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    }
    await page.waitForTimeout(4000);

    for (const shot of target.shots) {
      if (shot.scroll > 0) {
        await page.evaluate((ratio) => {
          window.scrollTo({ top: document.body.scrollHeight * ratio, behavior: "instant" });
        }, shot.scroll);
        await page.waitForTimeout(2600);
      }
      const file = path.join(dir, `${viewport.label}-${shot.name}.png`);
      await page.screenshot({ path: file });
      console.log(`  saved ${path.basename(file)}`);
    }

    await context.close();
  }
}

await browser.close();
console.log(`\ncandidates in ${OUT}`);
