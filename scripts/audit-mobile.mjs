/**
 * Audits every page at phone width for the things that actually break on a
 * phone: horizontal overflow, tap targets under the 44px minimum, text that
 * has been shrunk below readable size, images whose frame does not match their
 * aspect ratio, and any counter still showing a placeholder zero.
 *
 *   node scripts/audit-mobile.mjs [baseUrl]
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

const MIN_TAP = 44;
const MIN_FONT = 12;

const browser = await chromium.launch();
let problems = 0;

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await page.goto(base + route, { waitUntil: "networkidle" });
  // Walk the page so lazy content and scroll reveals have all fired.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const report = await page.evaluate(
    ({ minTap, minFont }) => {
      const out = { overflow: null, smallTaps: [], smallText: [], badRatios: [], zeros: [] };

      // Measure against clientWidth, not innerWidth: when the layout overflows,
      // innerWidth widens to match it and the comparison silently passes.
      const doc = document.documentElement;
      const viewport = doc.clientWidth;
      if (doc.scrollWidth > viewport + 1) {
        // Find what is actually sticking out.
        const wide = [];
        document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > viewport + 1) {
            wide.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`,
            );
          }
        });
        out.overflow = { scrollWidth: doc.scrollWidth, inner: viewport, culprits: wide.slice(0, 5) };
      }

      document.querySelectorAll("a, button").forEach((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || r.width === 0) return;
        // Skip-links are visually hidden until focused, so their collapsed box
        // is not the target a finger ever aims at.
        if (el.className.includes?.("sr-only")) return;
        if (r.height < minTap || r.width < minTap) {
          out.smallTaps.push(
            `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
          );
        }
      });

      document.querySelectorAll("p, li, span, figcaption, dd, dt, h1, h2, h3").forEach((el) => {
        if (!el.textContent?.trim()) return;
        if (el.children.length > 0) return; // only leaf text
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < minFont) {
          out.smallText.push(`${Math.round(size)}px "${el.textContent.trim().slice(0, 34)}"`);
        }
      });

      // Only content images need an exact fit. Card thumbnails on the home page
      // sit in a deliberately uniform frame and are meant to crop.
      document.querySelectorAll("figure img").forEach((img) => {
        if (!img.naturalWidth || !img.clientWidth) return;
        const nat = img.naturalWidth / img.naturalHeight;
        const box = img.clientWidth / img.clientHeight;
        if (Math.abs(nat - box) / nat > 0.04) {
          out.badRatios.push(
            `${img.src.split("%2F").pop()?.split("&")[0]} nat=${nat.toFixed(2)} box=${box.toFixed(2)}`,
          );
        }
      });

      // A counter stuck on its placeholder. "0 to 100" is a legitimate metric
      // value, so only a bare zero counts.
      document.querySelectorAll("dd").forEach((dd) => {
        const first = dd.textContent?.trim().split("\n")[0]?.trim() ?? "";
        if (first === "0") out.zeros.push(dd.textContent?.trim().slice(0, 40) ?? "");
      });

      return out;
    },
    { minTap: MIN_TAP, minFont: MIN_FONT },
  );

  const issues = [];
  if (report.overflow) {
    issues.push(
      `overflow: page is ${report.overflow.scrollWidth}px wide in a ${report.overflow.inner}px viewport`,
      ...report.overflow.culprits.map((c) => `    ${c}`),
    );
  }
  if (report.smallTaps.length) {
    issues.push(`${report.smallTaps.length} tap target(s) under ${MIN_TAP}px:`);
    issues.push(...[...new Set(report.smallTaps)].slice(0, 6).map((t) => `    ${t}`));
  }
  if (report.smallText.length) {
    issues.push(`text under ${MIN_FONT}px:`);
    issues.push(...[...new Set(report.smallText)].slice(0, 5).map((t) => `    ${t}`));
  }
  if (report.badRatios.length) {
    issues.push("image frame does not match its aspect ratio:");
    issues.push(...report.badRatios.slice(0, 5).map((t) => `    ${t}`));
  }
  if (report.zeros.length) {
    issues.push(`counter showing zero: ${report.zeros.join(" | ")}`);
  }
  if (consoleErrors.length) {
    issues.push(`page errors: ${consoleErrors.slice(0, 2).join(" | ")}`);
  }

  if (issues.length === 0) {
    console.log(`ok   ${route}`);
  } else {
    problems += issues.length;
    console.log(`WARN ${route}`);
    for (const line of issues) console.log(`  ${line}`);
  }

  await context.close();
}

await browser.close();
console.log(problems === 0 ? "\nmobile audit clean" : `\n${problems} issue line(s) to review`);
