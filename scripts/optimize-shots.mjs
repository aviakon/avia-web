/**
 * Turns chosen candidate screenshots into the finals the site ships.
 *
 * Wide captures are simply resized and re-encoded. Phone captures are composed
 * onto a 16:10 dark plate with a soft accent glow, so a portrait screenshot
 * still reads as a landscape card without being cropped to nothing.
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

/** Wide captures: resize, optionally crop a band, encode. */
const wide = [
  { from: "automa/desktop-hero.png", to: "automa-product.webp" },
  { from: "automa/desktop-diagnostics.png", to: "automa-film.webp" },
  { from: "automa/desktop-agent.png", to: "automa-agent.webp" },
  { from: "jobscout/landing.png", to: "jobscout-landing.webp" },
  { from: "jobscout/start.png", to: "jobscout-start.webp" },
  {
    from: "work-continuity-agent/report.png",
    to: "wca-report.webp",
    // Only the summary half: stats, open loops and the briefings. The activity
    // table below it is a detailed log of real browsing and does not belong on
    // a public page.
    crop: { top: 0, height: 820 },
  },
];

/** Portrait captures composed onto a plate. */
const plated = [
  { from: "poker-splitter/flow-03-filled.png", to: "poker-create.webp", accent: "#f0b429" },
  { from: "poker-splitter/flow-04-room.png", to: "poker-room.webp", accent: "#f0b429" },
  { from: "poker-splitter/mobile-landing.png", to: "poker-landing.webp", accent: "#f0b429" },
];

await mkdir(FINAL, { recursive: true });

const plate = (accent) =>
  Buffer.from(
    `<svg width="${PLATE_W}" height="${PLATE_H}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <radialGradient id="glow" cx="50%" cy="42%" r="62%">
           <stop offset="0%" stop-color="${accent}" stop-opacity="0.26"/>
           <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="#0a0a0f"/>
       <rect width="100%" height="100%" fill="url(#glow)"/>
     </svg>`,
  );

/** Rounds the corners of a phone capture so it sits on the plate like a device. */
async function rounded(buffer, width, height, radius) {
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
     </svg>`,
  );
  return sharp(buffer)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

for (const item of wide) {
  const source = sharp(path.join(CANDIDATES, item.from));
  const meta = await source.metadata();

  let pipeline = source;
  if (item.crop) {
    const scale = meta.width / WIDE;
    pipeline = pipeline.extract({
      left: 0,
      top: Math.round(item.crop.top * scale),
      width: meta.width,
      height: Math.min(Math.round(item.crop.height * scale), meta.height),
    });
  }

  const out = path.join(FINAL, item.to);
  await pipeline.resize({ width: WIDE }).webp({ quality: 80 }).toFile(out);
  console.log(`  ${item.to}`);
}

for (const item of plated) {
  const inner = 900; // rendered height of the phone shot on the plate
  const shot = await sharp(path.join(CANDIDATES, item.from))
    .resize({ height: inner })
    .png()
    .toBuffer();
  const { width, height } = await sharp(shot).metadata();
  const withCorners = await rounded(shot, width, height, 34);

  const out = path.join(FINAL, item.to);
  await sharp(plate(item.accent))
    .composite([
      {
        input: withCorners,
        top: Math.round((PLATE_H - height) / 2),
        left: Math.round((PLATE_W - width) / 2),
      },
    ])
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`  ${item.to}`);
}

console.log(`\nfinals in ${FINAL}`);
