/**
 * Turns chosen candidate screenshots into the finals the site ships.
 *
 * Wide captures are resized and re-encoded. Portrait captures are centred on a
 * plain black plate at their native pixel density, so a phone screenshot reads
 * as a landscape card without being cropped or softened.
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
const PLATE_W = 1600;
const PLATE_H = 1000;
const BLACK = "#0a0a0f";

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
 * Portrait captures, centred on black.
 *
 * Each one is written twice: a landscape plate for the project card on the home
 * page, which sits in a 16:10 frame, and a tall plate for the case study
 * gallery, where a portrait frame lets the phone render nearly three times
 * larger than it would inside a letterbox.
 */
const plated = [
  { from: "poker-splitter/flow-03-filled.png", to: "poker-create.webp" },
  { from: "poker-splitter/flow-04-room.png", to: "poker-room.webp" },
  {
    from: "poker-splitter/flow-03-filled.png",
    to: "poker-create-tall.webp",
    plate: { w: 760, h: 1040 },
  },
  {
    from: "poker-splitter/flow-04-room.png",
    to: "poker-room-tall.webp",
    plate: { w: 760, h: 1040 },
  },
];

await mkdir(FINAL, { recursive: true });

const plate = (w, h) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="${BLACK}"/>
     </svg>`,
  );

/** Softens only the corners, so the shot sits on the plate without a hard edge. */
async function rounded(buffer, width, height, radius) {
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
     </svg>`,
  );
  return sharp(buffer).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

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

for (const item of plated) {
  const { w: plateW, h: plateH } = item.plate ?? { w: PLATE_W, h: PLATE_H };
  // Leave a small margin so the shot never touches the edge of the plate.
  const inner = plateH - 80;

  const shot = await sharp(path.join(CANDIDATES, item.from))
    .resize({ height: inner, kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const { width, height } = await sharp(shot).metadata();
  const withCorners = await rounded(shot, width, height, 16);

  const out = path.join(FINAL, item.to);
  await sharp(plate(plateW, plateH))
    .composite([
      {
        input: withCorners,
        top: Math.round((plateH - height) / 2),
        left: Math.round((plateW - width) / 2),
      },
    ])
    .webp({ quality: 92 })
    .toFile(out);
  console.log(
    `  ${item.to.padEnd(26)} shot ${width}x${height} on a ${plateW}x${plateH} plate`,
  );
}

console.log(`\nfinals in ${FINAL}`);
