/** Samples one frame every N seconds of the commercial so a good preview window can be picked by eye. */
import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SOURCE =
  "C:\\Users\\aviak\\OneDrive\\Desktop\\automa\\automa visuals\\automa-landing\\public\\video\\automa-commercial.mp4";
const OUT = process.argv[2] ?? path.resolve("../frames-sample");
const EVERY = Number(process.argv[3] ?? 2);

await mkdir(OUT, { recursive: true });

await new Promise((resolve, reject) => {
  const child = spawn(
    ffmpegPath,
    [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", SOURCE,
      "-vf", `fps=1/${EVERY},scale=480:-2,drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow`,
      "-q:v", "4",
      path.join(OUT, "t-%02d.jpg"),
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  let stderr = "";
  child.stderr.on("data", (chunk) => (stderr += chunk));
  child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr))));
});

console.log(`frames every ${EVERY}s written to ${OUT}`);
