/**
 * Screenshot utility used during development and for gathering candidate
 * visuals from the live project sites.
 *
 *   node scripts/shoot.mjs <url> <outfile> [--width=1440] [--height=900]
 *                          [--full] [--wait=2500] [--scroll=0.5]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const [url, out, ...rest] = process.argv.slice(2);

if (!url || !out) {
  console.error("usage: node scripts/shoot.mjs <url> <outfile> [flags]");
  process.exit(1);
}

const flag = (name, fallback) => {
  const match = rest.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split("=")[1] : fallback;
};

const width = Number(flag("width", 1440));
const height = Number(flag("height", 900));
const wait = Number(flag("wait", 2500));
const scroll = Number(flag("scroll", 0));
const fullPage = rest.includes("--full");
const scale = Number(flag("scale", 1));

await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: scale,
  colorScheme: "dark",
  reducedMotion: "no-preference",
});
const page = await context.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
});

if (rest.includes("--sweep")) {
  // Walk the whole page so every scroll-triggered reveal has fired before we
  // capture, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 260));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

if (scroll > 0) {
  await page.evaluate((ratio) => {
    window.scrollTo(0, document.body.scrollHeight * ratio);
  }, scroll);
  await page.waitForTimeout(1200);
}

await page.waitForTimeout(wait);
await page.screenshot({ path: out, fullPage });

console.log(`saved ${out}`);
if (errors.length) {
  console.log(`\nconsole errors (${errors.length}):`);
  for (const error of errors.slice(0, 12)) console.log(`  ! ${error}`);
} else {
  console.log("no console errors");
}

await browser.close();
