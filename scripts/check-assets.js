/*
  scripts/check-assets.js
  Fails the build if any asset referenced by the source (or computed from
  the roster data) is missing from public/. Guards against the
  code/tooling drift that once shipped broken lightbox images.

  Usage: npm run check-assets
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PUB = path.join(ROOT, 'public');

const refs = new Set();

function walk(dir, cb) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  }
}

// 1. Literal /images/... and /audio/... references in TS/TSX (unicode-safe).
walk(SRC, (p) => {
  if (!/\.(ts|tsx)$/.test(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/\/(?:images|audio)\/[^\s"'`,)\\]+/g)) {
    refs.add(m[0].replace(/[.,)]+$/, ''));
  }
});

// 2. Variants computed at runtime from the roster data (src/data/members.json
//    — the roster used to live in src/lib/members.ts, which made this check
//    silently validate zero members once the data moved out):
//    <picture> srcset uses -640/-1024, the lightbox uses -lossless-1024.
//    The raw original is only required for members flagged `webp: false`
//    (everyone else is served the pre-generated WebP chain exclusively).
const membersData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'members.json'), 'utf8')
);
for (const member of membersData) {
  const img = member.image;
  if (!img) continue;
  if (member.webp === false) {
    refs.add(img);
    continue;
  }
  const base = img.replace(/\.(jpg|jpeg|png)$/i, '');
  refs.add(`${base}-640.webp`);
  refs.add(`${base}-1024.webp`);
  refs.add(`${base}-lossless-1024.webp`);
}

const missing = [...refs].filter((r) => !fs.existsSync(path.join(PUB, r)));

if (missing.length > 0) {
  console.error(`check-assets FAILED — ${missing.length} missing asset(s):`);
  console.error(missing.join('\n'));
  process.exit(1);
}

console.log(`check-assets OK — ${refs.size} referenced assets present`);
