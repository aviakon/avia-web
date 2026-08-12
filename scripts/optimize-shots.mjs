/**
 * Turns chosen candidate screenshots into the finals the site ships.
 *
 * Every image ships as the screen itself, with nothing around it. Wide captures
 * are resized and re-encoded; phone captures keep their own tall aspect ratio
 * and the page frames them to match, so no screenshot ever sits inside a band
 * of dead space.
 *
 * Nothing here ever upscales: an image smaller than the target width is
 * encoded at its own size instead, because upscaling is what makes a
 * screenshot look blurry.
 *
 *   node scripts/optimize-shots.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const CANDIDATES = path.resolve("public/screenshots/candidates");
const FINAL = path.resolve("public/screenshots");

const WIDE = 1600;
/** Phone screens render at most a third of the page width, so this is ample. */
const PHONE_W = 900;
/** The page's own canvas colour, so composed gaps disappear into the page. */
const BACKGROUND = { r: 10, g: 10, b: 15, alpha: 1 };

const wide = [
  { from: "automa/desktop-hero.png", to: "automa-product.webp" },
  { from: "automa/desktop-diagnostics.png", to: "automa-film.webp" },
  { from: "automa/desktop-agent.png", to: "automa-agent.webp" },
  { from: "jobscout/landing.png", to: "jobscout-landing.webp" },
  { from: "jobscout/start.png", to: "jobscout-start.webp" },
  // Element-scoped screenshots from a real scan (Full Stack Developer / React
  // Developer, 3,515 jobs scanned, 76 matches): the .stats-bar itself, and a
  // scrolled capture of the ranked list with its colour-coded score badges.
  { from: "jobscout/scoreboard-stats.png", to: "jobscout-scoreboard.webp" },
  { from: "jobscout/scoreboard-matches.png", to: "jobscout-matches.webp" },
  {
    from: "work-continuity-agent/report-2x.png",
    to: "wca-report.webp",
    // Rendered at 1240 CSS px on a 2x device, so device pixels are CSS px
    // doubled. The activity timeline heading starts at 831 CSS px; cutting at
    // 810 ends cleanly after the briefings, with no line of text clipped. The
    // timeline below it is a detailed log of real browsing and is deliberately
    // left out of a public page.
    cropDevicePx: { top: 0, height: 810 * 2 },
  },
];

/**
 * Phone captures, shipped as the screen and nothing else. No plate, no
 * padding: the frame on the page takes the image's own aspect ratio, so there
 * is never a band of dead space around a screenshot.
 */
const phones = [
  { from: "poker-splitter/game-02-table.png", to: "poker-table.webp" },
  { from: "poker-splitter/game-06-settlement.png", to: "poker-settlement.webp" },
  { from: "poker-splitter/game-01-lobby.png", to: "poker-lobby.webp" },
];

await mkdir(FINAL, { recursive: true });

for (const item of wide) {
  const source = sharp(path.join(CANDIDATES, item.from));
  const meta = await source.metadata();

  let pipeline = source;
  let height = meta.height;

  if (item.cropDevicePx) {
    height = Math.min(item.cropDevicePx.height, meta.height - item.cropDevicePx.top);
    pipeline = pipeline.extract({
      left: 0,
      top: item.cropDevicePx.top,
      width: meta.width,
      height,
    });
  }

  const target = Math.min(WIDE, meta.width);
  const out = path.join(FINAL, item.to);
  await pipeline
    .resize({ width: target, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 88 })
    .toFile(out);

  const ratio = (meta.width / height).toFixed(3);
  console.log(`  ${item.to.padEnd(24)} ${target}px wide · ratio ${ratio}`);
}

for (const item of phones) {
  const out = path.join(FINAL, item.to);
  const meta = await sharp(path.join(CANDIDATES, item.from)).metadata();
  const width = Math.min(PHONE_W, meta.width);

  await sharp(path.join(CANDIDATES, item.from))
    .resize({ width, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 90 })
    .toFile(out);

  const height = Math.round((meta.height / meta.width) * width);
  console.log(`  ${item.to.padEnd(26)} ${width}x${height}  ratio ${width} / ${height}`);
}

/**
 * The three poker screens composed into a single landscape image: the lobby,
 * the live table, and the settlement, side by side.
 *
 * One picture rather than three does two jobs at once. It gives the project
 * card on the home page something landscape to show without cropping a band
 * out of the felt, and it lets the case study lead with the whole story of the
 * product in a single frame. The gaps are painted in the page's own background
 * colour, so they read as space between phones rather than as bars around a
 * screenshot.
 */
{
  const sources = [
    "poker-splitter/game-01-lobby.png",
    "poker-splitter/game-02-table.png",
    "poker-splitter/game-06-settlement.png",
  ].map((p) => path.join(CANDIDATES, p));

  const first = await sharp(sources[0]).metadata();
  const phoneW = first.width;
  const phoneH = first.height;
  const gap = Math.round(phoneW * 0.09);

  const canvasW = phoneW * 3 + gap * 2;
  const canvasH = phoneH;

  const phones = await Promise.all(sources.map((s) => sharp(s).png().toBuffer()));

  // Compose at full size first. Sharp resizes its input before compositing, so
  // doing both in one chain would shrink the canvas out from under the phones.
  const composed = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: BACKGROUND,
    },
  })
    .composite(phones.map((input, i) => ({ input, top: 0, left: i * (phoneW + gap) })))
    .png()
    .toBuffer();

  const out = path.join(FINAL, "poker-combined.webp");
  await sharp(composed)
    .resize({ width: WIDE, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 90 })
    .toFile(out);

  const height = Math.round((canvasH / canvasW) * WIDE);
  console.log(
    `  poker-combined.webp        ${WIDE}x${height}  ratio ${WIDE} / ${height}  (3 screens)`,
  );
}

console.log(`\nfinals in ${FINAL}`);
