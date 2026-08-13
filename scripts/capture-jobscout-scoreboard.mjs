/**
 * Screenshots the two elements that read as "a scoreboard" from an
 * already-scanned JobScout candidate: the .stats-bar (companies, matches,
 * average and max score, excellent-match count) and the ranked match list
 * with its colour-coded score badges.
 *
 *   node scripts/capture-jobscout-scoreboard.mjs <candidate url>
 *
 * Output goes to public/screenshots/candidates/jobscout/, which is
 * gitignored; scripts/optimize-shots.mjs turns the chosen ones into finals.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [, , candidateUrl] = process.argv;
if (!candidateUrl) {
  console.error("usage: node scripts/capture-jobscout-scoreboard.mjs <candidate url>");
  process.exit(1);
}

const OUT = path.resolve("public/screenshots/candidates/jobscout");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

// The stats bar is a thin banner, so it is captured at 2x device scale for a
// crisp result; the ranked list is a normal full-page shot at 1x.
const hiDpi = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});
await hiDpi.goto(candidateUrl, { waitUntil: "networkidle", timeout: 60000 });
await hiDpi.waitForTimeout(1500);

const statsBar = hiDpi.locator(".stats-bar");
if (await statsBar.count()) {
  await statsBar.screenshot({ path: path.join(OUT, "scoreboard-stats.png") });
  console.log("saved scoreboard-stats.png");
} else {
  console.log("!! no .stats-bar found — has this candidate been scanned yet?");
}

const summary = await hiDpi.evaluate(() => {
  const stats = [...document.querySelectorAll(".stats-bar .stat")].map((s) => ({
    num: s.querySelector(".stat-num")?.textContent.trim(),
    label: s.querySelector(".stat-label")?.textContent.trim(),
  }));
  const scores = [...document.querySelectorAll("#matches-list .match")]
    .map((m) => Number(m.dataset.score))
    .sort((a, b) => b - a);
  return { stats, topScores: scores.slice(0, 10) };
});
console.log("stats-bar:", JSON.stringify(summary.stats));
console.log("top scores:", JSON.stringify(summary.topScores));
await hiDpi.close();

const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto(candidateUrl, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const listBox = await page.locator("#matches-list").boundingBox();
if (listBox) {
  await page.evaluate((y) => window.scrollTo(0, y - 70), listBox.y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, "scoreboard-matches.png") });
  console.log("saved scoreboard-matches.png");
}

await browser.close();
