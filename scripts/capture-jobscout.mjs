/**
 * Drives a local JobScout instance to a scanned candidate with a realistic,
 * broad web-stack profile, so the results are a genuine "excellent fit"
 * rather than a thin one that happens to score in the 60s.
 *
 * Requires the app running locally on :8077 (see the project's own README for
 * the venv setup). Skills are added directly via the API once a candidate
 * token exists, since driving the "type a skill, press Enter" chip UI is slow
 * and brittle by comparison.
 *
 *   node scripts/capture-jobscout.mjs
 *
 * Prints the candidate URL; pass it to capture-jobscout-scoreboard.mjs.
 */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8077";
const TITLES = ["Full Stack Developer", "Frontend Developer", "React Developer"];
const SKILLS = [
  "React", "JavaScript", "TypeScript", "Node.js", "HTML", "CSS",
  "Git", "REST API", "SQL", "MongoDB", "AWS", "Docker", "Python",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

await page.goto(`${BASE}/start`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.getByText(/המשך ללא קורות חיים|continue without/i).click();
await page.waitForTimeout(1500);

const role = page.locator('input[type="text"]:visible').first();
for (const title of TITLES) {
  await role.fill(title);
  await role.press("Enter");
  await page.waitForTimeout(300);
}

// The scan hits several live job APIs and can take well past Playwright's
// default click timeout, so fire the click without waiting on it and poll the
// URL separately instead of blocking on navigation.
await page
  .getByRole("button", { name: /מצאו לי משרות/ })
  .click({ noWaitAfter: true, timeout: 5000 })
  .catch(() => {});

const start = Date.now();
while (page.url().includes("/start") && Date.now() - start < 60000) {
  await page.waitForTimeout(1200);
}
await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});

const token = page.url().match(/\/candidate\/([^/?#]+)/)?.[1];
if (!token) throw new Error(`no candidate token in URL: ${page.url()}`);
console.log(`token: ${token}`);

for (const skill of SKILLS) {
  const res = await page.request.post(`${BASE}/candidate/${token}/skills/add`, {
    form: { skill },
  });
  console.log(`  + ${skill} -> ${res.status()}`);
}

// Reload so the page picks up the new profile, then trigger a real rescan
// against the fuller skill set.
await page.goto(`${BASE}/candidate/${token}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const searchBtn = page.getByRole("button", { name: /חפש משרות עכשיו/ });
if (await searchBtn.count()) {
  console.log("rescanning with the fuller skill set…");
  await searchBtn.click({ noWaitAfter: true, timeout: 5000 }).catch(() => {});

  const rescanStart = Date.now();
  while (Date.now() - rescanStart < 6 * 60 * 1000) {
    const matchCount = await page.locator("#matches-list .match").count();
    if (matchCount > 0) {
      console.log(`match cards: ${matchCount}`);
      break;
    }
    await page.waitForTimeout(4000);
    console.log(`  waiting… (${Math.round((Date.now() - rescanStart) / 1000)}s)`);
  }
}

await browser.close();

console.log(`\ncandidate URL: ${BASE}/candidate/${token}`);
console.log(
  `next: node scripts/capture-jobscout-scoreboard.mjs "${BASE}/candidate/${token}"`,
);
