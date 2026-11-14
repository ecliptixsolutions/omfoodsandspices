// Verifies that every /images/... path referenced in src/ exists in public/ and is non-empty.
// Usage: node scripts/check-images.mjs
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(join(root, "src")).filter((f) => /\.(tsx?|css)$/.test(f));
const refs = new Map();
for (const f of files) {
  for (const m of readFileSync(f, "utf8").matchAll(/["'`](\/images\/[A-Za-z0-9_\-./]+\.(?:webp|png|jpe?g|svg|avif))["'`]/g)) {
    if (!refs.has(m[1])) refs.set(m[1], f.replace(root + "/", ""));
  }
}
let bad = 0;
for (const [ref, from] of [...refs].sort()) {
  const p = join(root, "public", ref);
  const ok = existsSync(p) && statSync(p).size > 500;
  if (!ok) { bad++; console.log(`MISSING  ${ref}  (used in ${from})`); }
}
console.log(`${refs.size} image paths checked, ${bad} missing.`);
process.exit(bad ? 1 : 0);
