/**
 * Plays a whole game of Poker Splitter with four synthetic players so the
 * screens that matter can be photographed: the live table, and the settlement
 * with its list of transfers.
 *
 *   node scripts/capture-poker.mjs
 *
 * Output goes to public/screenshots/candidates/poker-splitter/, which is
 * gitignored; scripts/optimize-shots.mjs turns the chosen ones into finals.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const URL = "https://poker-splitter.web.app";
const OUT = path.resolve("public/screenshots/candidates/poker-splitter");
await mkdir(OUT, { recursive: true });

const phone = {
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

const browser = await chromium.launch();

const shot = async (page, name) => {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, `game-${name}.png`) });
  console.log(`    saved game-${name}.png`);
};

/** Everything the app currently shows, trimmed, for tracing the flow. */
const peek = async (page, label) => {
  const text = (await page.locator("body").innerText()).replace(/\n+/g, " | ").slice(0, 220);
  const buttons = await page
    .locator("button:visible")
    .evaluateAll((ns) => ns.map((n) => `${n.innerText.trim()}${n.disabled ? " [disabled]" : ""}`));
  console.log(`  ${label}: ${text}`);
  console.log(`    buttons: ${JSON.stringify(buttons)}`);
};

/** Types into the visible text field, then the numeric one. */
async function fillIdentity(page, name, buyIn = "100") {
  const inputs = page.locator("input:visible");
  for (let i = 0; i < (await inputs.count()); i += 1) {
    const input = inputs.nth(i);
    const type = await input.getAttribute("type");
    if (type === "number") {
      await input.fill("");
      await input.type(buyIn, { delay: 30 });
    } else {
      await input.fill("");
      await input.type(name, { delay: 30 });
    }
  }
  // React validation runs on change; give it a tick to enable the button.
  await page.waitForTimeout(600);
}

// ---- host creates the room -------------------------------------------------
console.log("host:");
const hostContext = await browser.newContext(phone);
const host = await hostContext.newPage();
await host.goto(URL, { waitUntil: "networkidle" });
await host.getByRole("button", { name: /start new room/i }).click();
await host.waitForTimeout(1600);

await fillIdentity(host, "Avia");
await host.getByText("Dragon", { exact: true }).click();
await host.waitForTimeout(500);
await peek(host, "create form");

await host.getByRole("button", { name: /create room/i }).click();
await host.waitForTimeout(4500);

const code = (await host.locator("body").innerText()).match(/\b[A-Z0-9]{6}\b/)?.[0];
console.log(`  room code: ${code}`);
if (!code) throw new Error("no room code on screen");

// ---- guests join -----------------------------------------------------------
const guests = [];
for (const [name, avatar, buyIn] of [
  ["Noa", "Wizard", "100"],
  ["Daniel", "Shark", "150"],
  ["Maya", "Lucky Cat", "100"],
]) {
  console.log(`${name}:`);
  const context = await browser.newContext(phone);
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /join room/i }).click();
  await page.waitForTimeout(1500);

  await page.locator("input:visible").first().fill(code);
  await page.getByRole("button", { name: /join game/i }).click();
  await page.waitForTimeout(2600);

  await fillIdentity(page, name, buyIn);
  await page.getByText(avatar, { exact: true }).click().catch(() => {});
  await page.waitForTimeout(500);
  await peek(page, "join form");

  const join = page.getByRole("button", { name: /^(join|join room|enter|confirm)/i }).last();
  await join.click();
  await page.waitForTimeout(3500);
  guests.push({ name, page });
}

await peek(host, "lobby");
await shot(host, "01-lobby");

// ---- start the game --------------------------------------------------------
const start = host.getByRole("button", { name: /start game/i });
if (await start.count()) {
  await start.first().click();
  await host.waitForTimeout(4500);
  console.log("  game started");
} else {
  console.log("  !! no start button");
}

await peek(host, "table");
await shot(host, "02-table");
if (guests[0]) await shot(guests[0].page, "03-table-guest");

// ---- end the game and settle ----------------------------------------------
// Final stacks that make the settlement interesting: two winners, two losers,
// summing back to the $450 pot.
const FINAL = { Avia: "40", Noa: "230", Daniel: "60", Maya: "120" };

await host.getByRole("button", { name: /end game/i }).click();
await host.waitForTimeout(2500);
await peek(host, "end game");
await shot(host, "04-endgame-empty");

// Each player's final amount is a numeric field, in the order they are listed.
const order = ["Avia", "Noa", "Daniel", "Maya"];
const amounts = host.locator('input[type="number"]:visible');
const count = await amounts.count();
console.log(`  end game has ${count} amount fields`);

for (let i = 0; i < count; i += 1) {
  const value = FINAL[order[i]];
  if (!value) continue;
  await amounts.nth(i).fill("");
  await amounts.nth(i).type(value, { delay: 40 });
  await host.waitForTimeout(300);
}
await host.waitForTimeout(900);
await peek(host, "end game filled");
await shot(host, "05-endgame-filled");

const settle = host
  .getByRole("button", { name: /settle|calculate|finish|done|show|result/i })
  .last();
if (await settle.count()) {
  await settle.click();
  await host.waitForTimeout(4000);
  await peek(host, "settlement");
  await shot(host, "06-settlement");
  await host.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await shot(host, "07-settlement-bottom");
} else {
  console.log("  !! no settle button found");
}

await browser.close();
console.log(`\ncandidates in ${OUT}`);
