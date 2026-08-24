/*
  scripts/generate-og-image.js
  Generates public/images/og-card.jpg (1200x630) — the Open Graph / social
  preview card. Ink & Gold brand: warm ink background, antique gold serif
  wordmark, scroll-frame border, ghost 風 accent, guild crest.

  Usage: node ./scripts/generate-og-image.js
*/
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 630;
const ROOT = path.join(__dirname, '..');

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1c1712"/>
      <stop offset="1" stop-color="#0d0b09"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.34" r="0.62">
      <stop offset="0" stop-color="#c9a45c" stop-opacity="0.16"/>
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
    stroke="#c9a45c" stroke-opacity="0.28" stroke-width="2"/>
  <path d="M 36 96 V 36 H 96" fill="none" stroke="#c9a45c" stroke-opacity="0.85" stroke-width="4"/>
  <path d="M ${W - 96} ${H - 36} H ${W - 36} V ${H - 96}" fill="none"
    stroke="#c9a45c" stroke-opacity="0.85" stroke-width="4"/>

  <!-- ghost wind character -->
  <text x="1052" y="196" text-anchor="middle" fill="#c9a45c" fill-opacity="0.14"
    font-family="Yu Mincho, MS Mincho, SimSun, serif" font-size="150">風</text>

  <!-- top / bottom accent bars -->
  <rect x="36" y="36" width="${W - 72}" height="4" fill="url(#accent)"/>
  <rect x="36" y="${H - 40}" width="${W - 72}" height="4" fill="url(#accent)" opacity="0.35"/>

  <!-- wordmark -->
  <text x="600" y="512" text-anchor="middle" fill="#c9a45c"
    font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="132"
    letter-spacing="26">ADOBO</text>
  <text x="613" y="572" text-anchor="middle" fill="#a89c85"
    font-family="Georgia, 'Times New Roman', serif" font-size="34"
    letter-spacing="18">WHERE WINDS MEET</text>
</svg>`;

(async () => {
  const logo = await sharp(path.join(ROOT, 'public/images/logo-320.webp'))
    .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 13, g: 11, b: 9, alpha: 1 } },
  })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logo, top: 52, left: Math.round((W - 300) / 2) },
    ])
    .jpeg({ quality: 85, chromaSubsampling: '4:4:4' })
    .toFile(path.join(ROOT, 'public/images/og-card.jpg'));

  const meta = await sharp(path.join(ROOT, 'public/images/og-card.jpg')).metadata();
  console.log(`og-card.jpg written: ${meta.width}x${meta.height}`);
})();
