// render.mjs — turn poster.html into entry.png, exactly 1024x1024.
//
// The poster is one self-contained HTML page (inline CSS and SVG only, no
// external files), so a headless Chromium screenshot at a 1024x1024 window
// is the whole render. After the shot we re-read the PNG header and its
// byte size and refuse to keep anything the bounty gate would refuse.
//
//   node render.mjs     (writes entry.png next to this file)

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(here, "poster.html");
const pngPath = join(here, "entry.png");

const BROWSERS = [
  process.env.CHROME_BIN,
  "/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-157.0.8103.78/chrome-headless-shell-linux64/chrome-headless-shell",
  "/home/hatch/.cache/puppeteer/chrome/linux-157.0.8103.78/chrome-linux64/chrome",
  "/opt/meta-chromium/chrome",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
].filter(Boolean);

function die(message) {
  console.error(`render: ${message}`);
  process.exit(1);
}

const browser = BROWSERS.find((candidate) => existsSync(candidate));
if (!browser) die(`no Chromium found among: ${BROWSERS.join(", ")}`);
if (!existsSync(htmlPath)) die(`missing poster at ${htmlPath}`);

const extraFlags = browser.includes("headless-shell") ? [] : ["--headless=new"];
const shot = spawnSync(
  browser,
  [
    ...extraFlags,
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1024,1024",
    "--virtual-time-budget=5000",
    `--screenshot=${pngPath}`,
    pathToFileURL(htmlPath).href,
  ],
  { encoding: "utf8" },
);
if (shot.status !== 0) die(`chromium exited ${shot.status}: ${shot.stderr ?? ""}`);
if (!existsSync(pngPath)) die("chromium wrote no screenshot");

const png = readFileSync(pngPath);
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (!signature.every((byte, i) => png[i] === byte)) die("output is not a PNG");
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 1024 || height !== 1024) die(`output is ${width}x${height}, not 1024x1024`);
if (png.length > 1_048_576) die(`output is ${png.length} bytes, over the 1 MiB cap`);

console.log(`render: entry.png ${width}x${height}, ${png.length} bytes`);
