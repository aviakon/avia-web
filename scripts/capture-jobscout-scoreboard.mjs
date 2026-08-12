/**
 * Screenshots the two elements that actually read as "a scoreboard": the
 * .stats-bar (matches, max score, average score, excellent matches,
 * companies) and a slice of the ranked .match list with its colour-coded
 * score badges. Element-scoped screenshots, so no pixel guessing.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [, , tokenUrl] = process.argv;
if (!tokenUrl) {
  console.error("usage: node scripts/capture-jobscout-scoreboard.mjs <candidate url>");
  process.exit(1);
}

const OUT = path.resolve("public/screenshots/candidates/jobscout");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
await page.goto(tokenUrl, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const statsBar = page.locator(".stats-bar");
console.log("stats-bar found:", await statsBar.count());
await statsBar.screenshot({ path: path.join(OUT, "scoreboard-stats.png") });
console.log("saved scoreboard-stats.png");

// The first few ranked matches, as one screenshot: from the top of the first
// .match card through the bottom of the third.
const matches = page.locator("#matches-list .match");
const total = await matches.count();
console.log("match cards:", total);

// Hide everything past the first few cards, then let Playwright screenshot the
// list element itself. An element screenshot scrolls as needed, so the result
// is never truncated by the viewport the way a manual clip rect would be.
const KEEP = 3;
await page.evaluate((keep) => {
  document
    .querySelectorAll("#matches-list .match")
    .forEach((el, i) => {
      if (i >= keep) el.style.display = "none";
    });
  // The sponsored slot is not part of the ranked results.
  document.querySelectorAll("#matches-list .ad, #matches-list .sponsored").forEach((el) => {
    el.style.display = "none";
  });
}, KEEP);
await page.waitForTimeout(500);

await page.locator("#matches-list").screenshot({
  path: path.join(OUT, "scoreboard-matches.png"),
});
console.log(`saved scoreboard-matches.png (first ${KEEP} cards)`);

await browser.close();
