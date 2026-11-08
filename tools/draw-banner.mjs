// Draw the README banner (assets/readme-banner.png) from the project website's hero painting: the yellow ground
// laid in brush strokes, the hand-lettered title, and the oil-stick robot. The page is opened in a headless
// Chrome, Chromium or Edge with motion reduced, so the drawing is complete; the banner keeps only the painting,
// the title and the subtitle.
//
//   node tools/draw-banner.mjs                         from the live website
//   node tools/draw-banner.mjs http://localhost:4182/  from a local copy of the website
//
// Run by hand after the website's hero changes, then commit the image.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "./readme-content.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [WIDTH, HEIGHT] = [1600, 520];
const url = process.argv[2] || SITE_URL;

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

// Turn the hero into a banner: no header, no author list or buttons, the subtitle on the white patch.
const STAGE = `(async () => {
  document.querySelector(".bar")?.remove();
  const hero = document.querySelector(".hero");
  Object.assign(hero.style, { minHeight: "0", height: "${HEIGHT}px", padding: "34px 64px 30px 104px", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" });
  const copy = hero.querySelector(".copy");
  const sub = copy.querySelector(".subtitle"); sub.remove();
  const kicker = document.createElement("p");
  kicker.textContent = "Awesome PhysicalWorldAgent";
  Object.assign(kicker.style, { margin: "0 0 18px", font: "400 22px/1 var(--marker)", color: "var(--red)", transform: "rotate(-2deg)", width: "max-content" });
  copy.prepend(kicker);
  copy.querySelector("h1").style.fontSize = "76px";
  const lower = copy.querySelector(".lower");
  lower.replaceChildren(sub);
  Object.assign(lower.style, { marginTop: "40px", width: "max-content" });
  Object.assign(sub.style, { margin: "0", fontSize: "23px" });
  const art = hero.querySelector(".art");
  Object.assign(art.style, { height: "${HEIGHT - 64}px", display: "flex", justifyContent: "center" });
  Object.assign(art.querySelector("svg").style, { height: "100%", width: "auto" });
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 900));   // the ground repaints around the new layout
  return [hero.offsetWidth, hero.offsetHeight];
})()`;

const browser = findBrowser();
const temp = await mkdtemp(path.join(os.tmpdir(), "banner-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(browser, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(temp, "profile")}`,
  "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch { await sleep(200); }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }, { name: "prefers-color-scheme", value: "light" }] });
  await send("Page.navigate", { url });
  await sleep(3000);
  const size = (await send("Runtime.evaluate", { expression: STAGE, awaitPromise: true, returnByValue: true })).result?.result?.value;
  if (!size) throw new Error("The page did not have the expected hero");
  const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 } });
  await writeFile(path.join(ROOT, "assets", "readme-banner.png"), Buffer.from(shot.result.data, "base64"));
  ws.close();
  console.log(`Wrote assets/readme-banner.png (${WIDTH}x${HEIGHT}) from ${url}`);
} finally {
  chrome.kill();
  await sleep(300);
  await rm(temp, { recursive: true, force: true }).catch(() => {});
}
