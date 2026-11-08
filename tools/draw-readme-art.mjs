// Draw the README section icons and section cards, each in a light and a dark version.
//
//   node tools/draw-readme-art.mjs
//
// The artwork is static: run this by hand after changing a card's text, a colour or an icon, and commit the SVGs.
// The README links them through <picture> so GitHub shows the version matching the reader's theme. Colours follow
// the manuscript's palette. The banner (assets/readme-banner.png) and the survey figures are not drawn here.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "readme");
const SANS = "Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

// Accent per role: [light theme, dark theme]. The light values are the manuscript's accent colours.
const ACCENT = {
  teal: ["#176b69", "#5fb8b3"],
  blue: ["#356887", "#8fb5d3"],
  amber: ["#9a682d", "#e0b07a"],
  red: ["#a74743", "#e48f8b"],
  green: ["#526f4b", "#9fc097"],
  grey: ["#596367", "#a9b4b8"],
};
const CHROME = {
  light: { tile: "#f4f7f6", tileLine: "#cbd5d3", card: "#ffffff", cardLine: "#cbd5d3", cardTile: "#e8f0ee", title: "#202729", sub: "#596367" },
  dark: { tile: "#161d1e", tileLine: "#2c3a3b", card: "#111718", cardLine: "#2c3a3b", cardTile: "#1b2627", title: "#e8eff0", sub: "#a9b4b8" },
};

// Glyphs on a 24x24 grid; "CUR" is replaced by the stroke colour.
const GLYPHS = {
  about: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.6" r=".6" fill="CUR"/>',
  questions: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7"/><circle cx="12" cy="16.9" r=".6" fill="CUR"/>',
  guide: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/>' +
    '<rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
  projects: '<rect x="3.5" y="13" width="6" height="6" rx="1"/><rect x="9.5" y="13" width="6" height="6" rx="1"/><rect x="6.5" y="7" width="6" height="6" rx="1"/>' +
    '<path d="M17.5 19V9.5l3-2.5"/>',
  benchmarks: '<path d="M4 20h16"/><rect x="5.5" y="11" width="3" height="7" rx=".8"/><rect x="10.5" y="6" width="3" height="12" rx=".8"/><rect x="15.5" y="9" width="3" height="9" rx=".8"/>',
  harness: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6 6l1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/>',
  evaluation: '<path d="M8 4.5h8l1.5 2h1.5v13.5h-14V6.5h1.5Z"/><path d="M8.5 13l2.4 2.4 4.6-4.8"/>',
  problems: '<path d="M5.5 21V4"/><path d="M5.5 4.5h11l-2.4 3.8 2.4 3.8h-11"/>',
  references: '<path d="M4.5 5.5c2.6-1 5-.8 7.5.8v13c-2.5-1.6-4.9-1.8-7.5-.8v-13Z"/><path d="M19.5 5.5c-2.6-1-5-.8-7.5.8v13c2.5-1.6 4.9-1.8 7.5-.8v-13Z"/>',
  contribute: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
  contributors: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/>' +
    '<circle cx="16.5" cy="9.5" r="2.4"/><path d="M15.6 14.2c2.4-.2 4.4 1.3 4.9 4.3"/>',
  star: '<path d="M12 4.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 4.2Z"/>',
  cite: '<path d="M5 17.5c0-4.5 1.2-7.5 4.5-9.5M13 17.5c0-4.5 1.2-7.5 4.5-9.5"/><circle cx="7" cy="16" r="2.2"/><circle cx="15" cy="16" r="2.2"/>',
  layout: '<path d="M4 6.5h6l1.6 2H20v10H4z"/>',
};
const ICON_ACCENT = {
  about: "teal", questions: "amber", guide: "teal", projects: "amber", benchmarks: "green", harness: "blue", evaluation: "red",
  problems: "red", references: "grey", contribute: "red", contributors: "teal", star: "amber", cite: "grey", layout: "grey",
};
// Section cards: [file key and icon, title, subtitle]; tools/render-readme.mjs links each card to its section.
const CARDS = [
  ["about", "Overview", "The world as the test suite"],
  ["questions", "Research questions", "What do programs buy?"],
  ["harness", "Writing programs", "From action to training worlds"],
  ["evaluation", "Testing programs", "Traces, judges, simulators"],
  ["benchmarks", "Learning from the world", "Libraries and weights"],
  ["problems", "Open problems", "Toward physical CI"],
];

function glyph(name, color, scale, dx, dy) {
  const body = GLYPHS[name].replaceAll("CUR", color);
  return `<g transform="translate(${dx} ${dy}) scale(${scale})" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
}

function icon(name, theme) {
  const c = CHROME[theme];
  const color = ACCENT[ICON_ACCENT[name]][theme === "light" ? 0 : 1];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">` +
    `<rect x=".5" y=".5" width="35" height="35" rx="9" fill="${c.tile}" stroke="${c.tileLine}"/>${glyph(name, color, 1, 6, 6)}</svg>\n`;
}

function card(index, key, title, sub, theme) {
  const c = CHROME[theme];
  const color = ACCENT[ICON_ACCENT[key]][theme === "light" ? 0 : 1];
  const text = (value) => value.replaceAll("&", "&amp;").replaceAll("'", "’");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 246 70" width="246" height="70" role="img" aria-label="${text(title)}: ${text(sub)}">` +
    `<defs><clipPath id="r"><rect width="246" height="70" rx="9.5"/></clipPath></defs>` +
    `<rect width="246" height="70" rx="9.5" fill="${c.card}"/><rect width="4" height="70" fill="${color}" clip-path="url(#r)"/>` +
    `<rect x=".5" y=".5" width="245" height="69" rx="9" fill="none" stroke="${c.cardLine}"/>` +
    `<rect x="19" y="17" width="36" height="36" rx="9" fill="${c.cardTile}"/>${glyph(key, color, 0.75, 28, 26)}` +
    `<text x="64" y="33" fill="${c.title}" font-family="${SANS}" font-size="14.5" font-weight="700">${text(title)}</text>` +
    `<text x="64" y="51" fill="${c.sub}" font-family="${SANS}" font-size="11">${text(sub)}</text>` +
    `<text x="232" y="18" fill="${color}" font-family="${SANS}" font-size="10" font-weight="700" text-anchor="end">0${index}</text></svg>\n`;
}

await mkdir(path.join(OUT, "icons"), { recursive: true });
let written = 0;
for (const theme of Object.keys(CHROME)) {
  for (const name of Object.keys(ICON_ACCENT)) {
    await writeFile(path.join(OUT, "icons", `${name}-${theme}.svg`), icon(name, theme));
    written += 1;
  }
  for (const [i, [key, title, sub]] of CARDS.entries()) {
    await writeFile(path.join(OUT, `card-${key}-${theme}.svg`), card(i + 1, key, title, sub, theme));
    written += 1;
  }
}
console.log(`Wrote ${written} SVGs under assets/readme.`);
