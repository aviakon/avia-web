/**
 * Verifies every route renders, every internal link resolves, and every
 * external link the site claims as evidence is actually reachable.
 *
 *   node scripts/smoke.mjs [baseUrl] [--local]
 *
 * --local skips the external link checks, for a quick health check after a
 * server restart.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const local = args.includes("--local");
const base = (args.find((arg) => !arg.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/projects/automa",
  "/projects/poker-splitter",
  "/projects/jobscout",
  "/projects/jewelry-ig-bot",
  "/projects/work-continuity-agent",
  "/sitemap.xml",
  "/robots.txt",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let failures = 0;
const externals = new Set();

for (const route of routes) {
  const errors = [];
  page.removeAllListeners("pageerror");
  page.on("pageerror", (error) => errors.push(String(error)));

  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  const status = response?.status() ?? 0;
  const title = await page.title();

  const ok = status === 200 && errors.length === 0;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${status} ${route.padEnd(36)} ${title.slice(0, 46)}`,
  );
  for (const error of errors) console.log(`       ! ${error}`);

  for (const href of await page.$$eval("a[href^='http']", (nodes) =>
    nodes.map((n) => n.href),
  )) {
    if (!href.startsWith(base)) externals.add(href);
  }
}

if (!local) console.log("\nexternal links:");
for (const href of local ? [] : externals) {
  try {
    const response = await page.request.get(href, { timeout: 25000 });
    const status = response.status();
    const ok = status < 400;
    if (!ok) failures += 1;
    console.log(`${ok ? "ok  " : "FAIL"} ${status} ${href}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL  --- ${href}  (${String(error).slice(0, 80)})`);
  }
}

await browser.close();
console.log(failures === 0 ? "\nall checks passed" : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
