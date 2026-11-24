// main.ts — entry for make.fun's "Sum up 24 November's world news in one
// image" (news-image-20261124).
//
// The artwork ships in this repository as entry.png, a newspaper front page
// for Tuesday 24 November 2026 drawn in poster.html and rendered by
// render.mjs. This program's job is only to place those bytes, unchanged,
// at /output/entry.png for the judge:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It runs offline, writes identical bytes on every run, and checks the
// image before and after copying so a broken entry fails here instead of
// in front of the judge.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BYTE_LIMIT = 1_048_576; // the gate allows at most 1 MiB

function stop(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

const ownDir = dirname(fileURLToPath(import.meta.url));
const imagePath = join(ownDir, "entry.png");
if (!existsSync(imagePath)) stop(`no entry.png beside main.ts (looked in ${ownDir})`);

const bytes = readFileSync(imagePath);
if (bytes.length === 0) stop("entry.png is empty");
if (bytes.length > BYTE_LIMIT) {
  stop(`entry.png is ${bytes.length} bytes, over the ${BYTE_LIMIT} limit`);
}

// Magic bytes decide the format at the gate: PNG starts 89 50 4E 47,
// JPEG starts FF D8 FF. Refuse anything else before copying it.
const pngMagic = [0x89, 0x50, 0x4e, 0x47];
const looksPng = pngMagic.every((b, i) => bytes[i] === b);
const looksJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (!looksPng && !looksJpeg) stop("entry.png is neither a PNG nor a JPEG");

// The gate also caps the picture at 1024x1024 pixels. A PNG carries its
// size in the IHDR chunk, right after the signature: width and height are
// big-endian uint32s at offsets 16 and 20, so check them while we can.
if (looksPng) {
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width > 1024 || height > 1024) {
    stop(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);

if (!readFileSync(outPath).equals(bytes)) {
  stop(`the copy at ${outPath} does not match entry.png`);
}
console.log(`entry: copied ${bytes.length} bytes to ${outPath}`);
