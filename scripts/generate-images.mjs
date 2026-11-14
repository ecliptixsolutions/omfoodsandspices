/**
 * Generates the PLACEHOLDER imagery used by the site: illustrated still-lifes of
 * dehydrated onion & garlic (flakes, minced, granules, powder) plus logo/OG art.
 *
 * These are illustrations, NOT photographs. Before launch, replace the files in
 * /public/images with the company's real product photography (same file names
 * keep every page working; see README → "Replacing images").
 *
 * Usage: npm run images
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => {
  const f = join(root, "public", p);
  mkdirSync(dirname(f), { recursive: true });
  return f;
};

/* ---------- seeded random ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f1 = (n) => Math.round(n * 10) / 10;

/* ---------- palettes (image pixels only; site colours live in src/theme.css) ---------- */
const PAL = {
  onion: { fills: ["#f1e2b6", "#e9d39a", "#f4e8c8", "#dcc283", "#ead9a8", "#e2c98c"], edge: "#a98748" },
  garlic: { fills: ["#f8f1dc", "#f0e6c8", "#fbf6e6", "#eadfb8", "#f4ebd2", "#e8dcb4"], edge: "#bba972" },
};
const FOREST = "#21392c";
const FOREST_DEEP = "#182a20";
const COPPER = "#b0623f";
const CREAM = "#fbf4e6";

/* ---------- particle path builders (one <path> per colour = fast) ---------- */
function blob(cx, cy, r, aspect, rot, pts, jitter, rand) {
  const n = pts;
  const verts = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const rr = r * (1 - jitter + rand() * jitter * 2);
    let x = Math.cos(ang) * rr * aspect;
    let y = Math.sin(ang) * rr;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    verts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  // smooth closed path through midpoints
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = verts[i], p1 = verts[(i + 1) % n];
    const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
    if (i === 0) {
      const pl = verts[n - 1];
      d += `M${f1((pl[0] + p0[0]) / 2)} ${f1((pl[1] + p0[1]) / 2)}`;
    }
    d += `Q${f1(p0[0])} ${f1(p0[1])} ${f1(mx)} ${f1(my)}`;
  }
  return d + "Z";
}

const SHAPES = {
  flakes: { count: 520, size: [15, 30], aspect: [1.1, 2.1], pts: [6, 8], jitter: 0.28 },
  minced: { count: 2400, size: [5, 10], aspect: [0.9, 1.5], pts: [5, 6], jitter: 0.3 },
  granules: { count: 4200, size: [2.6, 4.8], aspect: [0.9, 1.2], pts: [5, 6], jitter: 0.18 },
  powder: { count: 9000, size: [1.1, 2.1], aspect: [1, 1], pts: [4, 5], jitter: 0.1 },
};

/** Fill a disc (cx,cy,R) with particles. Returns SVG string. */
function pile({ cx, cy, R, kind, form, rand, density = 1, light = true }) {
  const s = SHAPES[form];
  const pal = PAL[kind];
  const groups = pal.fills.map(() => "");
  const n = Math.round(s.count * density * (R / 330) ** 2);
  for (let i = 0; i < n; i++) {
    const ang = rand() * Math.PI * 2;
    const rad = Math.sqrt(rand()) * R;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    const size = s.size[0] + rand() * (s.size[1] - s.size[0]);
    const aspect = s.aspect[0] + rand() * (s.aspect[1] - s.aspect[0]);
    const pts = s.pts[0] + Math.floor(rand() * (s.pts[1] - s.pts[0] + 1));
    const d = blob(x, y, size, aspect, rand() * Math.PI, pts, s.jitter, rand);
    groups[Math.floor(rand() * groups.length)] += d;
  }
  const strokeW = form === "powder" ? 0 : form === "granules" ? 0.35 : 0.7;
  let svg = "";
  // base tone under the particles so gaps don't show the bowl floor
  const base = pal.fills[3];
  svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${base}"/>`;
  groups.forEach((d, i) => {
    svg += `<path d="${d}" fill="${pal.fills[i]}" ${strokeW ? `stroke="${pal.edge}" stroke-opacity="0.28" stroke-width="${strokeW}"` : ""}/>`;
  });
  if (form === "flakes") {
    // translucent veins on larger flakes give a dried-slice look
    let veins = "";
    for (let i = 0; i < n * 0.55; i++) {
      const ang = rand() * Math.PI * 2;
      const rad = Math.sqrt(rand()) * R;
      const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
      const len = 5 + rand() * 9, a = rand() * Math.PI;
      veins += `M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * len)} ${f1(Math.sin(a) * len)}`;
    }
    svg += `<path d="${veins}" fill="none" stroke="${pal.edge}" stroke-opacity="0.2" stroke-width="0.6"/>`;
  }
  return svg;
}

/* ---------- bowls & bulbs ---------- */
let uid = 0;
function bowl({ cx, cy, R, kind, form, rand, density, extra = "" }) {
  const id = `b${uid++}`;
  const rim = R + 40;
  return `
  <defs>
    <radialGradient id="${id}rim" cx="35%" cy="30%" r="85%">
      <stop offset="0" stop-color="#fbf6ea"/><stop offset="0.6" stop-color="#e9dfca"/><stop offset="1" stop-color="#c9bb9f"/>
    </radialGradient>
    <radialGradient id="${id}floor" cx="50%" cy="50%" r="60%">
      <stop offset="0" stop-color="#e6dcc3"/><stop offset="1" stop-color="#d3c6a6"/>
    </radialGradient>
    <radialGradient id="${id}shade" cx="38%" cy="32%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#2a1a05" stop-opacity="0.38"/>
    </radialGradient>
    <clipPath id="${id}clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    <filter id="${id}blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${rim * 0.07}"/></filter>
  </defs>
  <ellipse cx="${cx + rim * 0.12}" cy="${cy + rim * 0.18}" rx="${rim * 1.02}" ry="${rim * 0.98}" fill="#3a2a10" opacity="0.32" filter="url(#${id}blur)"/>
  <circle cx="${cx}" cy="${cy}" r="${rim}" fill="url(#${id}rim)"/>
  <circle cx="${cx}" cy="${cy}" r="${rim - 6}" fill="none" stroke="#b6a789" stroke-opacity="0.6" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="url(#${id}floor)"/>
  <g clip-path="url(#${id}clip)">
    ${pile({ cx, cy, R, kind, form, rand, density })}
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}shade)"/>
  </g>
  ${extra}`;
}

function shadowEllipse(cx, cy, rx, ry) {
  const id = `s${uid++}`;
  return `<defs><filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${Math.max(rx, ry) * 0.12}"/></filter></defs>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3a2a10" opacity="0.3" filter="url(#${id})"/>`;
}

function garlicBulb(cx, cy, s, rot = 0) {
  const id = `g${uid++}`;
  const body = "M0,-1 C0.12,-0.72 0.95,-0.5 0.95,0.12 C0.95,0.68 0.5,0.92 0,0.92 C-0.5,0.92 -0.95,0.68 -0.95,0.12 C-0.95,-0.5 -0.12,-0.72 0,-1 Z";
  let seg = "";
  [-0.62, -0.32, 0, 0.32, 0.62].forEach((o) => {
    seg += `<path d="M0,-0.9 C${o * 1.05},-0.45 ${o * 1.25},0.25 ${o * 0.8},0.9" fill="none" stroke="#c9b98d" stroke-width="0.02" stroke-opacity="0.75"/>`;
  });
  return `${shadowEllipse(cx + s * 0.18, cy + s * 0.55, s * 0.95, s * 0.5)}
  <defs><radialGradient id="${id}" cx="35%" cy="30%" r="85%"><stop offset="0" stop-color="#fffaf0"/><stop offset="0.65" stop-color="#eee2c2"/><stop offset="1" stop-color="#cdbb8f"/></radialGradient></defs>
  <g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">
    <path d="${body}" fill="url(#${id})" stroke="#bfae82" stroke-width="0.015"/>
    ${seg}
    <path d="M-0.08,0.88 q0.08,0.12 0.16,0 M-0.04,0.9 l-0.05,0.1 M0.04,0.9 l0.05,0.1 M0,0.9 l0,0.12" fill="none" stroke="#8d7a52" stroke-width="0.02"/>
    <path d="M0,-1 l0.01,-0.12" stroke="#b9a77c" stroke-width="0.04" stroke-linecap="round"/>
  </g>`;
}

function onionBulb(cx, cy, s, rot = 0, hue = 0) {
  const id = `o${uid++}`;
  const c = [["#e6b672", "#c98443", "#8f5424"], ["#e3a88a", "#bf7452", "#86442b"]][hue];
  const body = "M0,-0.98 C0.1,-0.72 1,-0.62 1,0.05 C1,0.62 0.58,0.9 0,0.9 C-0.58,0.9 -1,0.62 -1,0.05 C-1,-0.62 -0.1,-0.72 0,-0.98 Z";
  let seg = "";
  [-0.7, -0.45, -0.2, 0.05, 0.3, 0.55, 0.78].forEach((o) => {
    seg += `<path d="M0,-0.85 C${o * 1.2},-0.4 ${o * 1.35},0.3 ${o * 0.7},0.86" fill="none" stroke="${c[2]}" stroke-width="0.018" stroke-opacity="0.45"/>`;
  });
  return `${shadowEllipse(cx + s * 0.16, cy + s * 0.6, s * 1.0, s * 0.5)}
  <defs><radialGradient id="${id}" cx="34%" cy="30%" r="90%"><stop offset="0" stop-color="${c[0]}"/><stop offset="0.6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>
  <g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">
    <path d="${body}" fill="url(#${id})" stroke="${c[2]}" stroke-opacity="0.5" stroke-width="0.015"/>
    ${seg}
    <path d="M0,-0.98 q0.02,-0.14 0.0,-0.22 M-0.03,-0.97 q-0.05,-0.1 -0.04,-0.18" fill="none" stroke="${c[2]}" stroke-width="0.03" stroke-linecap="round"/>
    <path d="M-0.18,0.84 l-0.06,0.14 M-0.06,0.9 l-0.02,0.12 M0.06,0.9 l0.02,0.12 M0.18,0.84 l0.06,0.14" fill="none" stroke="#6e4a26" stroke-width="0.022" stroke-linecap="round"/>
  </g>`;
}

/** loose flakes/clove pieces scattered on the surface */
function spill({ cx, cy, rx, ry, kind, form, n, rand }) {
  const pal = PAL[kind];
  const s = SHAPES[form];
  let d = "";
  for (let i = 0; i < n; i++) {
    const ang = rand() * Math.PI * 2, rad = Math.sqrt(rand());
    const x = cx + Math.cos(ang) * rad * rx, y = cy + Math.sin(ang) * rad * ry;
    const size = s.size[0] + rand() * (s.size[1] - s.size[0]);
    d += blob(x, y, size, s.aspect[0] + rand() * (s.aspect[1] - s.aspect[0]), rand() * Math.PI, 6, s.jitter, rand);
  }
  return `<path d="${d}" fill="${pal.fills[0]}" stroke="${pal.edge}" stroke-opacity="0.6" stroke-width="0.7"/>`;
}

/* ---------- backgrounds ---------- */
function surface(w, h, tone = "warm") {
  const [a, b] = tone === "warm" ? ["#efe3c7", "#d9c7a0"] : ["#f2e9d3", "#dccfae"];
  return `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0.13 0"/>
    </filter>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1d08" stop-opacity="0.28"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>`;
}
const vignette = (w, h) => `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;

/* ---------- scenes ---------- */
function productScene(kind, form, seed) {
  const w = 1200, h = 900, rand = rng(seed);
  const cx = 560, cy = 450, R = 300;
  const bulb = kind === "garlic" ? garlicBulb(1010, 640, 120, -14) : onionBulb(1020, 650, 118, 10);
  const extra = form === "powder" ? "" : spill({ cx: 930, cy: 300, rx: 150, ry: 120, kind, form, n: form === "flakes" ? 9 : form === "minced" ? 40 : 90, rand });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${surface(w, h)}
    ${bowl({ cx, cy, R, kind, form, rand, density: 1 })}
    ${bulb}
    ${extra}
    ${vignette(w, h)}
  </svg>`;
}

function heroScene(kind, seed) {
  const w = 1920, h = 1080, rand = rng(seed);
  const forms = ["flakes", "minced", "granules", "powder"];
  const pos = [[1180, 300, 180], [1500, 640, 200], [1090, 790, 150], [1700, 250, 140]];
  let g = surface(w, h, "cool");
  pos.forEach(([x, y, r], i) => {
    g += bowl({ cx: x, cy: y, R: r, kind, form: forms[i], rand, density: 1 });
  });
  g += kind === "garlic"
    ? garlicBulb(870, 620, 130, -12) + garlicBulb(960, 860, 100, 22)
    : onionBulb(860, 640, 135, 8, 0) + onionBulb(970, 880, 100, -18, 1);
  g += vignette(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

function formatsScene(kind, seed) {
  const w = 1200, h = 900, rand = rng(seed);
  const forms = ["flakes", "minced", "granules", "powder"];
  const pos = [[330, 290, 170], [790, 270, 170], [330, 650, 170], [790, 640, 170]];
  let g = surface(w, h);
  pos.forEach(([x, y, r], i) => { g += bowl({ cx: x, cy: y, R: r, kind, form: forms[i], rand, density: 1 }); });
  g += kind === "garlic" ? garlicBulb(1075, 450, 85, 14) : onionBulb(1075, 450, 85, -10);
  g += vignette(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

function aboutScene(seed) {
  const w = 1100, h = 1300, rand = rng(seed);
  let g = surface(w, h);
  g += bowl({ cx: 400, cy: 360, R: 240, kind: "onion", form: "flakes", rand });
  g += bowl({ cx: 700, cy: 900, R: 250, kind: "garlic", form: "granules", rand });
  g += onionBulb(220, 860, 150, -8, 0) + onionBulb(330, 1130, 105, 14, 1);
  g += garlicBulb(860, 400, 120, 12) + garlicBulb(930, 1180, 90, -20);
  g += vignette(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

function pageScene(variant, seed) {
  const w = 1200, h = 800, rand = rng(seed);
  let g = surface(w, h, variant % 2 ? "warm" : "cool");
  const combos = [
    [["onion", "flakes"], ["garlic", "minced"]],
    [["garlic", "granules"], ["onion", "powder"]],
    [["onion", "minced"], ["garlic", "flakes"]],
    [["garlic", "powder"], ["onion", "granules"]],
    [["onion", "granules"], ["garlic", "powder"]],
    [["garlic", "flakes"], ["onion", "minced"]],
  ][variant % 6];
  g += bowl({ cx: 400, cy: 400, R: 230, kind: combos[0][0], form: combos[0][1], rand });
  g += bowl({ cx: 860, cy: 420, R: 190, kind: combos[1][0], form: combos[1][1], rand });
  g += variant % 2 ? garlicBulb(1060, 160, 80, 15) + onionBulb(150, 690, 80, -10) : onionBulb(1070, 680, 84, 10) + garlicBulb(130, 130, 78, -14);
  g += vignette(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

/* ---------- brand art ---------- */
function monogram(size) {
  const r = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${r}" cy="${r}" r="${r}" fill="${FOREST}"/>
    <circle cx="${r}" cy="${r}" r="${r * 0.9}" fill="none" stroke="${COPPER}" stroke-width="${size * 0.018}"/>
    <text x="${r}" y="${r + size * 0.17}" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-weight="700" font-size="${size * 0.42}" letter-spacing="${size * 0.01}" fill="${CREAM}">OM</text>
  </svg>`;
}

function ogScene() {
  const w = 1200, h = 630, rand = rng(99);
  let g = `<rect width="${w}" height="${h}" fill="${FOREST}"/>`;
  g += `<g transform="translate(560 -10) scale(1)">${bowl({ cx: 330, cy: 200, R: 130, kind: "onion", form: "flakes", rand })}${bowl({ cx: 300, cy: 500, R: 110, kind: "garlic", form: "granules", rand })}</g>`;
  g += `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#fade)"/>`;
  const defs = `<defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0.35" stop-color="${FOREST}" stop-opacity="1"/><stop offset="0.7" stop-color="${FOREST}" stop-opacity="0"/></linearGradient></defs>`;
  g += `<circle cx="120" cy="140" r="56" fill="none" stroke="${CREAM}" stroke-width="3"/>
  <text x="120" y="158" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-weight="700" font-size="48" fill="${CREAM}">OM</text>
  <text x="80" y="290" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-weight="700" font-size="60" fill="${CREAM}">Dehydrated Onion</text>
  <text x="80" y="360" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-weight="700" font-size="60" fill="#e3a27f">&amp; Garlic Ingredients</text>
  <text x="80" y="430" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-size="28" fill="${CREAM}" fill-opacity="0.9">OM Food and Spices LLP · Gujarat, India</text>
  <text x="80" y="560" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-size="24" letter-spacing="3" fill="${CREAM}" fill-opacity="0.8">NATURAL FLAVOURS. BETTER TOMORROWS.</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${g}</svg>`;
}

/* ---------- render ---------- */
async function webp(svg, file, quality = 80) {
  await sharp(Buffer.from(svg)).webp({ quality, effort: 5 }).toFile(out(file));
  console.log("  ✓", file);
}

const t0 = Date.now();
console.log("Generating placeholder illustrations…");

const productSeeds = {
  "onion-flakes": ["onion", "flakes", 11],
  "onion-minced": ["onion", "minced", 12],
  "onion-granules": ["onion", "granules", 13],
  "onion-powder": ["onion", "powder", 14],
  "garlic-flakes": ["garlic", "flakes", 21],
  "garlic-minced": ["garlic", "minced", 22],
  "garlic-granules": ["garlic", "granules", 23],
  "garlic-powder": ["garlic", "powder", 24],
};
for (const [name, [kind, form, seed]] of Object.entries(productSeeds)) {
  await webp(productScene(kind, form, seed), `images/products/${name}.webp`, 78);
}

await webp(heroScene("garlic", 31), "images/hero/hero-garlic.webp", 74);
await webp(heroScene("onion", 32), "images/hero/hero-onion.webp", 74);

await webp(formatsScene("onion", 41), "images/sections/formats-onion.webp", 78);
await webp(formatsScene("garlic", 42), "images/sections/formats-garlic.webp", 78);
await webp(aboutScene(51), "images/sections/about.webp", 78);

const pageNames = ["plant", "process", "quality", "responsible", "packaging", "sourcing"];
for (let i = 0; i < pageNames.length; i++) {
  await webp(pageScene(i, 60 + i), `images/sections/${pageNames[i]}.webp`, 78);
}

// Brand assets are supplied by the company and are not regenerated here.
console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
