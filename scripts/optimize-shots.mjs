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

const wide = [
  { from: "automa/desktop-hero.png", to: "automa-product.webp" },
  { from: "automa/desktop-diagnostics.png", to: "automa-film.webp" },
  { from: "automa/desktop-agent.png", to: "automa-agent.webp" },
  { from: "jobscout/landing.png", to: "jobscout-landing.webp" },
  { from: "jobscout/start.png", to: "jobscout-start.webp" },
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
 * The project card on the home page is a fixed 16:10 frame, which a portrait
 * phone cannot fill. Rather than letterbox it, take a landscape band from the
 * middle of the table, centred on the pot.
 */
{
  const source = path.join(CANDIDATES, "poker-splitter/game-02-table.png");
  const meta = await sharp(source).metadata();

  // Trim the dark surround the app draws either side of the felt, so the crop
  // is table and nothing else.
  const left = Math.round(meta.width * 0.075);
  const width = Math.round(meta.width * 0.85);
  const bandHeight = Math.round((width / 16) * 10);
  const centre = Math.round(meta.height * 0.45); // the felt, centred on the pot
  const top = Math.max(0, Math.min(centre - bandHeight / 2, meta.height - bandHeight));

  const out = path.join(FINAL, "poker-cover.webp");
  await sharp(source)
    .extract({ left, top: Math.round(top), width, height: bandHeight })
    .resize({ width: WIDE, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 88 })
    .toFile(out);
  console.log(`  poker-cover.webp           ${WIDE}px wide, felt only`);
}

console.log(`\nfinals in ${FINAL}`);
