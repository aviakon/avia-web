/**
 * Drives the live Poker Splitter app far enough to photograph the actual
 * product — the room screen and the live table — rather than just the
 * landing page. Writes candidates for hand-picking.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/screenshots/candidates/poker-splitter");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const shot = async (name) => {
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUT, `flow-${name}.png`) });
  console.log(`  saved flow-${name}.png`);
};

await page.goto("https://poker-splitter.web.app", { waitUntil: "networkidle" });
await shot("01-landing");

await page.getByRole("button", { name: /start new room/i }).click();
await page.waitForTimeout(1800);
await shot("02-create");

// Fill whatever the create form asks for, generically.
const inputs = page.locator("input:visible");
const count = await inputs.count();
console.log(`create form has ${count} visible inputs`);
for (let i = 0; i < count; i += 1) {
  const input = inputs.nth(i);
  const type = await input.getAttribute("type");
  const placeholder = (await input.getAttribute("placeholder")) ?? "";
  console.log(`  input ${i}: type=${type} placeholder="${placeholder}"`);
  if (type === "number") await input.fill("50");
  else await input.fill("Avia");
}
await page.getByText("Dragon", { exact: true }).click().catch(() => {});
await shot("03-filled");

// Submit the create form, whatever the button is called.
const createButton = page
  .getByRole("button", { name: /create|start|continue|let's go|go/i })
  .last();
await createButton.click();
await page.waitForTimeout(4500);
await shot("04-room");

// Scroll through the room screen so the table, QR invite and controls are all
// photographed.
for (const [index, ratio] of [0.35, 0.7, 1].entries()) {
  await page.evaluate((value) => {
    window.scrollTo({ top: document.body.scrollHeight * value, behavior: "instant" });
  }, ratio);
  await shot(`05-room-${index + 1}`);
}

console.log("\n--- room text ---");
console.log((await page.locator("body").innerText()).slice(0, 1200));

await browser.close();
