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
  await page.waitForTimeout(800);

  const scan = () => page.evaluate(() => {
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

  // The hero terminal types itself out and loops, so a single sample can miss a
  // line that has not been written yet. Sample across a full cycle and take the
  // union of everything seen.
  const hits = new Set(await scan());
  if (route === "/") {
    for (let i = 0; i < 16; i += 1) {
      await page.waitForTimeout(1000);
      for (const hit of await scan()) hits.add(hit);
    }
  }

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
