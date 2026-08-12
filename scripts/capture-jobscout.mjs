/**
 * Drives the local JobScout instance far enough to reach the scored results
 * dashboard, so the actual product (a ranked list of matches) can be
 * photographed rather than just the marketing landing page.
 *
 * Requires the app running locally on :8077 (see README for the venv setup).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:8077";
const OUT = path.resolve("public/screenshots/candidates/jobscout");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });

await page.goto(`${BASE}/start`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const skip = page.getByText(/המשך ללא קורות חיים|continue without/i);
await skip.click();
await page.waitForTimeout(2500);

console.log("after skip, url:", page.url());
console.log("body:", (await page.locator("body").innerText()).slice(0, 400).replace(/\n+/g, " | "));

// If a role/keywords form appears, fill the minimum and submit.
const textInputs = page.locator('input[type="text"]:visible, textarea:visible');
const count = await textInputs.count();
console.log(`text inputs on this step: ${count}`);
for (let i = 0; i < count; i += 1) {
  const input = textInputs.nth(i);
  const placeholder = (await input.getAttribute("placeholder")) ?? "";
  console.log(`  input ${i}: placeholder="${placeholder}"`);
}
// The role field adds a chip on Enter rather than being a plain text value.
if (count > 0) {
  const role = textInputs.first();
  for (const title of ["Full Stack Developer", "React Developer"]) {
    await role.fill(title);
    await role.press("Enter");
    await page.waitForTimeout(400);
  }
}

const buttons = await page.locator("button:visible").evaluateAll((ns) =>
  ns.map((n) => n.innerText.trim()).filter(Boolean),
);
console.log("buttons after adding roles:", JSON.stringify(buttons));

const continueBtn = page.getByRole("button", { name: /מצאו לי משרות/ }).last();
if (await continueBtn.count()) {
  // The scan hits six live job sources and can take well past Playwright's
  // default click timeout, so fire the click without waiting on it and poll
  // the URL separately instead.
  await continueBtn.click({ noWaitAfter: true, timeout: 5000 }).catch(() => {});
  const start = Date.now();
  while (page.url().includes("/start") && Date.now() - start < 60000) {
    await page.waitForTimeout(1500);
  }
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
}

console.log("final url:", page.url());
console.log("final body:", (await page.locator("body").innerText()).slice(0, 500).replace(/\n+/g, " | "));

await page.screenshot({ path: path.join(OUT, "flow-final.png"), fullPage: false });
console.log("saved flow-final.png");

await browser.close();
