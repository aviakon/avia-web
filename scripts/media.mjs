/**
 * Turns the source AUTOMA commercial into web-ready assets.
 *
 *   node scripts/media.mjs probe      — report duration/resolution of the source
 *   node scripts/media.mjs build      — write preview loop, poster and full cut
 *
 * The 78 MB original is never shipped; everything written here lands in
 * public/media and is sized for the page it appears on.
 */
import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SOURCE =
  "C:\\Users\\aviak\\OneDrive\\Desktop\\automa\\automa visuals\\automa-landing\\public\\video\\automa-commercial.mp4";
const OUT = path.resolve("public/media");

/**
 * Window of the commercial used for the silent loop on the flagship card:
 * the in-car sequence where the device is lit on the dash, which reads as
 * product-in-use rather than a title card.
 */
const PREVIEW_START = "00:00:28";
const PREVIEW_SECONDS = "13";
/** Poster frame — a beat into the same sequence, so it matches the loop. */
const POSTER_AT = "00:00:36";

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve(stderr) : reject(new Error(stderr.slice(-2500))),
    );
  });

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function probe() {
  const info = await run(["-hide_banner", "-i", SOURCE, "-f", "null", "-"]).catch(
    (error) => error.message,
  );
  const lines = String(info)
    .split("\n")
    .filter((line) => /Duration|Stream #|Video:|Audio:/.test(line));
  console.log(lines.join("\n").trim());
  console.log(`\nsource size: ${mb((await stat(SOURCE)).size)}`);
}

async function build() {
  await mkdir(OUT, { recursive: true });

  const preview = path.join(OUT, "automa-preview.mp4");
  const previewWebm = path.join(OUT, "automa-preview.webm");
  const poster = path.join(OUT, "automa-poster.jpg");
  const full = path.join(OUT, "automa-commercial.mp4");

  console.log("→ poster frame");
  await run([
    "-y", "-hide_banner", "-loglevel", "error",
    "-ss", POSTER_AT, "-i", SOURCE,
    "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3",
    poster,
  ]);

  console.log("→ silent preview loop (mp4)");
  await run([
    "-y", "-hide_banner", "-loglevel", "error",
    "-ss", PREVIEW_START, "-t", PREVIEW_SECONDS, "-i", SOURCE,
    "-vf", "scale=1280:-2", "-an",
    "-c:v", "libx264", "-crf", "28", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    preview,
  ]);

  console.log("→ silent preview loop (webm)");
  await run([
    "-y", "-hide_banner", "-loglevel", "error",
    "-ss", PREVIEW_START, "-t", PREVIEW_SECONDS, "-i", SOURCE,
    "-vf", "scale=1280:-2", "-an",
    "-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0", "-row-mt", "1",
    previewWebm,
  ]);

  console.log("→ full commercial (720p, with audio)");
  await run([
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", SOURCE,
    "-vf", "scale=1280:-2",
    "-c:v", "libx264", "-crf", "27", "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    full,
  ]);

  for (const file of [poster, preview, previewWebm, full]) {
    console.log(`  ${path.basename(file)}  ${mb((await stat(file)).size)}`);
  }
}

const command = process.argv[2] ?? "probe";
if (command === "probe") await probe();
else if (command === "build") await build();
else {
  console.error("usage: node scripts/media.mjs <probe|build>");
  process.exit(1);
}
