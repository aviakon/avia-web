/**
 * Scans the visible text of every page for hyphens and dashes.
 *
 * The site's copy is written without them by choice, so this guards against a
 * dash creeping back in through an edit.
 *
 *   node scripts/check-dashes.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/projects/automa",
  "/projects/poker-splitter",
  "/projects/jobscout",
  "/projects/jewelry-ig-bot",
  "/projects/work-continuity-agent",
];

const DASH = /[-‐-―−]/;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

let found = 0;

for (const route of routes) {
  await page.goto(base + route, { waitUntil: "networkidle" });
  // The hero terminal types itself out over roughly nine seconds, so a short
  // wait can miss a line that has not been written yet.
  await page.waitForTimeout(route === "/" ? 14000 : 800);

  const hits = await page.evaluate(() => {
    const pattern = /[-‐-―−]/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const out = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent ?? "";
      if (!text.trim() || !pattern.test(text)) continue;
      // Skip anything visually hidden, which is not copy a reader sees.
      const parent = node.parentElement;
      if (!parent) continue;
      const style = getComputedStyle(parent);
      if (style.display === "none" || style.visibility === "hidden") continue;
      out.push(text.trim().slice(0, 120));
    }
    return out;
  });

  const titleHit = DASH.test(await page.title()) ? [`<title> ${await page.title()}`] : [];
  const all = [...titleHit, ...hits];

  if (all.length === 0) {
    console.log(`ok   ${route}`);
  } else {
    found += all.length;
    console.log(`DASH ${route}`);
    for (const hit of all) console.log(`       ${hit}`);
  }
}

await browser.close();
console.log(found === 0 ? "\nno dashes in visible copy" : `\n${found} dash(es) found`);
process.exit(found === 0 ? 0 : 1);
