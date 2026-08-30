// Render two SVG variants of the mango-leaf design to a single
// preview PNG so we can see what the shape actually looks like.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'previews');
fs.mkdirSync(outDir, { recursive: true });

// Two variants rendered side by side on a single 880x320 image so we
// can compare them. Each is rendered at 4x for clarity.
const svgA = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 40 40">
  <rect width="320" height="320" fill="#181510" />
  <g transform="translate(140 0) scale(8)" fill="none" stroke="#c9a45c" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 36 C 12 30, 8 22, 12 12 C 16 6, 22 4, 24 4 C 26 8, 30 16, 28 24 C 26 30, 22 34, 20 36 Z" transform="rotate(-4 20 20)" />
    <path d="M20 36 L 20 38" stroke-width="0.15" />
    <path d="M20 36 L 21 14" stroke-width="0.09" stroke-opacity="0.65" transform="rotate(-4 20 20)" />
  </g>
  <text x="160" y="300" text-anchor="middle" fill="#a89c85" font-family="Cormorant Garamond, serif" font-size="14">Option A</text>
</svg>`;

const svgB = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 40 40">
  <rect width="320" height="320" fill="#181510" />
  <g transform="translate(140 0) scale(8)" fill="none" stroke="#c9a45c" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z" transform="rotate(-3 20 20)" />
    <path d="M 21 37 L 21 38.5" stroke-width="0.15" />
    <path d="M 21 36 C 20 28, 19 19, 21 11" stroke-width="0.09" stroke-opacity="0.55" transform="rotate(-3 20 20)" />
  </g>
  <text x="160" y="300" text-anchor="middle" fill="#a89c85" font-family="Cormorant Garamond, serif" font-size="14">Option B (chosen)</text>
</svg>`;

const placement = `
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="320" viewBox="0 0 880 320">
  <rect width="880" height="320" fill="#181510" />
  <g transform="translate(0 0)">
    <g transform="translate(140 0) scale(8)" fill="none" stroke="#c9a45c" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z" transform="rotate(-3 20 20)" />
      <path d="M 21 37 L 21 38.5" stroke-width="0.15" />
      <path d="M 21 36 C 20 28, 19 19, 21 11" stroke-width="0.09" stroke-opacity="0.55" transform="rotate(-3 20 20)" />
    </g>
  </g>
  <g transform="translate(320 0)">
    <g transform="translate(140 0) scale(8)" fill="none" stroke="#c9a45c" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z" transform="rotate(-3 20 20)" />
      <path d="M 21 37 L 21 38.5" stroke-width="0.15" />
      <path d="M 21 36 C 20 28, 19 19, 21 11" stroke-width="0.09" stroke-opacity="0.55" transform="rotate(-3 20 20)" />
    </g>
  </g>
  <g transform="translate(640 0)">
    <g transform="translate(140 0) scale(8)" fill="none" stroke="#c9a45c" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z" transform="rotate(-3 20 20)" />
      <path d="M 21 37 L 21 38.5" stroke-width="0.15" />
      <path d="M 21 36 C 20 28, 19 19, 21 11" stroke-width="0.09" stroke-opacity="0.55" transform="rotate(-3 20 20)" />
    </g>
  </g>
  <text x="160" y="200" text-anchor="middle" fill="#c9a45c" font-family="Cormorant Garamond, serif" font-size="20" font-style="italic">hero</text>
  <text x="160" y="225" text-anchor="middle" fill="#a89c85" font-family="Inter, sans-serif" font-size="11" letter-spacing="2">~6% opacity</text>
  <text x="480" y="200" text-anchor="middle" fill="#c9a45c" font-family="Cormorant Garamond, serif" font-size="20" font-style="italic">rules masthead</text>
  <text x="480" y="225" text-anchor="middle" fill="#a89c85" font-family="Inter, sans-serif" font-size="11" letter-spacing="2">~14% opacity</text>
  <text x="800" y="200" text-anchor="middle" fill="#c9a45c" font-family="Cormorant Garamond, serif" font-size="20" font-style="italic">footer ADOBO</text>
  <text x="800" y="225" text-anchor="middle" fill="#a89c85" font-family="Inter, sans-serif" font-size="11" letter-spacing="2">separator</text>
  <text x="440" y="290" text-anchor="middle" fill="#857a63" font-family="Inter, sans-serif" font-size="12" letter-spacing="3">PROPOSED PLACEMENTS</text>
</svg>`;

(async () => {
  await sharp(Buffer.from(svgA)).png().toFile(path.join(outDir, 'leaf-option-a.png'));
  await sharp(Buffer.from(svgB)).png().toFile(path.join(outDir, 'leaf-option-b.png'));
  await sharp(Buffer.from(placement)).png().toFile(path.join(outDir, 'leaf-placements.png'));
  console.log('rendered to', outDir);
})();
