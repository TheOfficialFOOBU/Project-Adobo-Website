// Usage: npm install && npm run convert-images
// This script walks images/ and produces WebP versions at multiple widths
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', 'images');
const SIZES = [320, 480, 640, 800, 1024, 1600];
const LOSSLESS_SIZES = [640, 1024];

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

(async () => {
  const files = walk(INPUT_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.webp') continue; // skip existing webp
    const dir = path.dirname(file);
    const base = path.basename(file, ext);
    const input = file;
    try {
      const image = sharp(input);
      const metadata = await image.metadata();
      // produce full-size webp at high quality (no enlargement)
      await image
        .webp({quality: 90})
        .toFile(path.join(dir, `${base}.webp`));
      // produce responsive sizes (no upscaling)
      for (const w of SIZES) {
        if (metadata.width && metadata.width < w) continue;
        await sharp(input)
          .resize({width: w, withoutEnlargement: true})
          .webp({quality: 85})
          .toFile(path.join(dir, `${base}-${w}.webp`));
      }

      // Produce lossless variants for key sizes for better sharpness (no upscaling)
      for (const w of LOSSLESS_SIZES) {
        if (metadata.width && metadata.width < w) continue;
        await sharp(input)
          .resize({width: w, withoutEnlargement: true})
          .webp({lossless: true})
          .toFile(path.join(dir, `${base}-lossless-${w}.webp`));
      }
      // also produce a full-size lossless webp (if source large enough)
      await image.webp({lossless: true}).toFile(path.join(dir, `${base}-lossless.webp`));
      console.log('Converted', input);
    } catch (err) {
      console.error('Error converting', input, err.message);
    }
  }
  console.log('Done.');
})();
