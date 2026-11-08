// Draw the README banner (assets/readme-banner.png) from the cover illustration (assets/teaser.webp) and the
// survey title, with a headless Chrome, Chromium or Edge.
//
//   node tools/draw-banner.mjs
//
// Run by hand after changing the title or the illustration, then commit the image.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SURVEY } from "./readme-content.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [WIDTH, HEIGHT, TITLE_SIZE, TEASER_WIDTH] = [1600, 470, 54, 960];

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!found) throw new Error("No Chrome, Chromium or Edge found; set CHROME_PATH");
  return found;
}

function page() {
  const asset = (file) => pathToFileURL(path.join(ROOT, file)).href;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; src: url("${asset("assets/fonts/manrope-latin.woff2")}") format("woff2"); font-weight: 200 800; }
html, body { margin: 0; }
body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; font-family: Manrope, sans-serif; color: #202729; background: #f4f7f6; position: relative; }
.copy { position: absolute; left: 72px; top: 50%; transform: translateY(-50%); width: ${WIDTH - TEASER_WIDTH - 130}px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; color: #176b69; margin-bottom: 34px; letter-spacing: .01em; }
.brand i { width: 10px; height: 10px; border-radius: 3px; background: linear-gradient(135deg, #176b69, #00a5be); }
.brand span { color: #9a682d; }
h1 { margin: 0; font-size: ${TITLE_SIZE}px; line-height: 1.1; font-weight: 700; letter-spacing: -0.01em; }
h1 em { font-style: normal; color: #176b69; }
.subtitle { margin: 22px 0 0; font-size: 24px; font-weight: 600; color: #596367; }
.subtitle b { color: #9a682d; font-weight: 700; }
.teaser { position: absolute; right: 40px; top: 50%; transform: translateY(-50%); width: ${TEASER_WIDTH}px; border-radius: 16px;
  box-shadow: 0 16px 38px rgba(32, 39, 41, 0.18), 0 0 0 2px rgba(255, 255, 255, 0.7); }
</style></head><body>
<div class="copy">
  <div class="brand"><i></i><div>Awesome <span>PhysicalWorld</span>Agent</div></div>
  <h1>When the World<br>Is the <em>Test Suite</em></h1>
  <p class="subtitle">Agentic Intelligence for the <b>Physical World</b></p>
</div>
<img class="teaser" src="${asset("assets/teaser.webp")}" alt="">
</body></html>`;
}

if (SURVEY.title !== "When the World Is the Test Suite") throw new Error("Update the banner title layout for the new title");
const browser = findBrowser();
const temp = await mkdtemp(path.join(os.tmpdir(), "banner-"));
try {
  const html = path.join(temp, "banner.html");
  await writeFile(html, page());
  execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--allow-file-access-from-files", `--user-data-dir=${path.join(temp, "profile")}`, "--virtual-time-budget=5000",
    `--window-size=${WIDTH},${HEIGHT}`, `--screenshot=${path.join(ROOT, "assets", "readme-banner.png")}`, pathToFileURL(html).href],
    { stdio: "ignore" });
  console.log(`Wrote assets/readme-banner.png (${WIDTH}x${HEIGHT})`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
