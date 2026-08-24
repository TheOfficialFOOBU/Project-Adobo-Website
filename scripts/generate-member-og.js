/*
  scripts/generate-member-og.js
  Generates public/images/og/members/<slug>.jpg (1200x630) — Open Graph
  cards for every member profile. Discord/X/Facebook don't render WebP in
  link previews, so profiles share these JPGs instead of the live WebPs.

  Brand: same Ink & Gold language as scripts/generate-og-image.js.
  Usage: node ./scripts/generate-member-og.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 630;
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'og', 'members');

function slugifyMember(name) {
  const cleaned = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return (
    cleaned
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'member'
  );
}

/** Unique slugs, mirroring src/lib/members.ts MEMBER_SLUGS. */
function buildSlugs(members) {
  const used = new Set();
  const map = new Map();
  for (const member of members) {
    let slug = slugifyMember(member.name);
    for (let n = 2; used.has(slug); n += 1) slug = `${slugifyMember(member.name)}-${n}`;
    used.add(slug);
    map.set(member.name, slug);
  }
  return map;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Truncate long text to fit the fixed layout box. */
function clampText(value, max) {
  const text = String(value ?? '');
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Wrap text into lines of at most `perLine` characters (word-safe). */
function wrapText(value, perLine, maxLines) {
  const words = String(value ?? '')
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > perLine && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = candidate;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (words.join(' ').length > lines.join(' ').length) {
      lines[maxLines - 1] = `${last.slice(0, Math.max(0, perLine - 1)).trimEnd()}…`;
    }
  }
  return lines;
}

function frameSvg(name, position, klass, quote) {
  const safeName = escapeXml(clampText(name, 18));
  const safePosition = escapeXml(position.toUpperCase());
  const safeClass = escapeXml(clampText(klass.toUpperCase(), 38));
  const quoteLines = quote ? wrapText(`“${quote}”`, 52, 2) : [];
  const quoteBlock = quoteLines
    .map(
      (line, index) =>
        `<text x="560" y="${438 + index * 40}" fill="#cfc4ab" font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="27">${escapeXml(line)}</text>`
    )
    .join('\n  ');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1c1712"/>
      <stop offset="1" stop-color="#0d0b09"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.28" cy="0.36" r="0.7">
      <stop offset="0" stop-color="#c9a45c" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#c9a45c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b8432e"/>
      <stop offset="0.55" stop-color="#c9a45c"/>
      <stop offset="1" stop-color="#c9a45c" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- scroll frame with corner brackets -->
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none"
    stroke="#c9a45c" stroke-opacity="0.26" stroke-width="2"/>
  <path d="M 36 96 V 36 H 96" fill="none" stroke="#c9a45c" stroke-opacity="0.85" stroke-width="4"/>
  <path d="M ${W - 96} ${H - 36} H ${W - 36} V ${H - 96}" fill="none" stroke="#c9a45c" stroke-opacity="0.85" stroke-width="4"/>

  <!-- top / bottom accent bars -->
  <rect x="36" y="36" width="${W - 72}" height="4" fill="url(#accent)"/>
  <rect x="36" y="${H - 40}" width="${W - 72}" height="4" fill="url(#accent)" opacity="0.35"/>

  <!-- ghost wind character -->
  <text x="1058" y="230" text-anchor="middle" fill="#c9a45c" fill-opacity="0.12"
    font-family="Yu Mincho, MS Mincho, SimSun, serif" font-size="170">風</text>

  <!-- photo plinth -->
  <rect x="118" y="95" width="360" height="440" rx="10" fill="none"
    stroke="#c9a45c" stroke-opacity="0.55" stroke-width="3"/>

  <!-- identity block -->
  <text x="560" y="205" fill="#e0bd75" font-family="Georgia, 'Times New Roman', serif"
    font-size="24" letter-spacing="9">${safePosition}</text>
  <text x="560" y="300" fill="#ede5d3" font-family="Georgia, 'Times New Roman', serif"
    font-weight="bold" font-size="76">${safeName}</text>
  <text x="562" y="365" fill="#85b39d" font-family="Verdana, sans-serif"
    font-size="21" letter-spacing="4">${safeClass}</text>
  ${quoteBlock}

  <!-- guild mark -->
  <text x="${W - 80}" y="${H - 78}" text-anchor="end" fill="#a89c85"
    font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="12">ADOBO</text>
</svg>`;
}

async function loadPhoto(member) {
  const base = path.join(ROOT, 'public', member.image.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
  const candidates = [`${base}-lossless-640.webp`, `${base}-640.webp`, `${base}.webp`];
  const source =
    candidates.find((candidate) => fs.existsSync(candidate)) ??
    path.join(ROOT, 'public', member.image);
  return sharp(source)
    .resize(356, 436, { fit: 'cover', position: 'top' })
    .webp({ quality: 90 })
    .toBuffer();
}

(async () => {
  const members = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src', 'data', 'members.json'), 'utf8')
  );
  const slugs = buildSlugs(members);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const member of members) {
    const slug = slugs.get(member.name);
    const outFile = path.join(OUT_DIR, `${slug}.jpg`);
    try {
      const photo = await loadPhoto(member);
      await sharp({
        create: { width: W, height: H, channels: 4, background: { r: 13, g: 11, b: 9, alpha: 1 } },
      })
        .composite([
          {
            input: Buffer.from(frameSvg(member.name, member.position, member.class, member.quote)),
            top: 0,
            left: 0,
          },
          { input: photo, top: 97, left: 120 },
        ])
        .jpeg({ quality: 85, chromaSubsampling: '4:4:4' })
        .toFile(outFile);
      console.log(`og/members/${slug}.jpg written`);
    } catch (err) {
      console.error(`FAILED for ${member.name}:`, err.message);
      process.exitCode = 1;
    }
  }
})();
