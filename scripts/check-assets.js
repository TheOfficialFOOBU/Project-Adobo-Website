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
    // Skip dynamic template-literal refs (e.g. `/images/og/members/${slug}.jpg`)
    // — those are covered by the roster expansion below.
    if (m[0].includes('${')) continue;
    refs.add(m[0].replace(/[.,)]+$/, ''));
  }
});

// 2. Variants computed at runtime from the roster data (src/data/members.json
//    — the roster used to live in src/lib/members.ts, which made this check
//    silently validate zero members once the data moved out):
//    <picture> srcset uses -640/-1024, the lightbox uses -1600.
//    The raw original is only required for members flagged `webp: false`
//    (everyone else is served the pre-generated WebP chain exclusively).
const membersData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'members.json'), 'utf8')
);

// Kebab-case slug mirroring slugifyMember() in src/lib/members.ts, with the
// same -2/-3 de-duplication for name collisions.
function slugifyMember(name) {
  const cleaned = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return (
    cleaned
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'member'
  );
}

function memberSlugs(members) {
  const slugs = [];
  const used = new Set();
  for (const member of members) {
    let slug = slugifyMember(member.name);
    for (let n = 2; used.has(slug); n += 1) slug = `${slugifyMember(member.name)}-${n}`;
    used.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

const slugs = memberSlugs(membersData);

for (let i = 0; i < membersData.length; i += 1) {
  const member = membersData[i];
  // Profile-page OG card (/images/og/members/<slug>.jpg), referenced
  // dynamically in src/app/members/[slug]/page.tsx.
  refs.add(`/images/og/members/${slugs[i]}.jpg`);
  const img = member.image;
  if (!img) continue;
  if (member.webp === false) {
    refs.add(img);
    continue;
  }
  const base = img.replace(/\.(jpg|jpeg|png)$/i, '');
  refs.add(`${base}-640.webp`);
  refs.add(`${base}-1024.webp`);
  refs.add(`${base}-1600.webp`);
}

const missing = [...refs].filter((r) => !fs.existsSync(path.join(PUB, r)));

if (missing.length > 0) {
  console.error(`check-assets FAILED — ${missing.length} missing asset(s):`);
  console.error(missing.join('\n'));
  process.exit(1);
}

console.log(`check-assets OK — ${refs.size} referenced assets present`);
