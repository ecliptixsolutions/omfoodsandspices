// WCAG AA contrast checker for the brand tokens in src/theme.css.
// Usage: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");

function token(name) {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`Token --${name} not found`);
  return m[1].trim();
}

function oklchToRgb(l, c, h) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3, M = m_ ** 3, S = s_ ** 3;
  const lin = [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
  return lin.map((v) => Math.min(1, Math.max(0, v)));
}

function toLinear(v) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function parse(value) {
  const v = value.trim();
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => toLinear(x / 255));
  }
  const m = v.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (m) {
    const l = parseFloat(m[1]) / (v.includes("%") ? 100 : 1);
    return oklchToRgb(l, parseFloat(m[2]), parseFloat(m[3]));
  }
  throw new Error(`Cannot parse colour: ${value}`);
}

const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
function ratio(fg, bg) {
  const a = lum(parse(fg)), b = lum(parse(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const pairs = [
  ["ink", "paper", 4.5, "Headings on cream"],
  ["ink", "beige", 4.5, "Headings on beige"],
  ["body", "paper", 4.5, "Body text on cream"],
  ["body", "beige", 4.5, "Body text on beige"],
  ["copper-ink", "paper", 4.5, "Copper text/eyebrows on cream"],
  ["copper-ink", "beige", 4.5, "Copper text/eyebrows on beige"],
  ["on-copper", "copper", 4.5, "Button label on copper"],
  ["on-forest", "forest", 4.5, "Light text on forest"],
  ["on-forest-muted", "forest", 4.5, "Muted text on forest"],
  ["copper-light", "forest", 4.5, "Copper highlight on forest"],
  ["forest", "paper", 4.5, "Forest on cream"],
];

let failed = 0;
console.log("WCAG AA contrast check (min 4.5:1 for normal text)\n");
for (const [fg, bg, min, label] of pairs) {
  const r = ratio(token(`brand-${fg}`), token(`brand-${bg}`));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${label}  (${fg} on ${bg})`);
}
if (failed) {
  console.error(`\n${failed} pair(s) below AA.`);
  process.exit(1);
}
console.log("\nAll pairs meet WCAG AA.");
