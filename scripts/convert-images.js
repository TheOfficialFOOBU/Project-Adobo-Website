/*
  scripts/convert-images.js
  Convert images to WebP at multiple sizes for responsive delivery.
  Coded by FOOBU
  Usage: npm install && npm run convert-images
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', 'public', 'images');
const SIZES = [320, 480, 640, 800, 1024, 1600];

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach((file) => {
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
  const files = walk(INPUT_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.webp') continue; // skip existing webp
    const dir = path.dirname(file);
    const base = path.basename(file, ext);
    const input = file;
    try {
      const image = sharp(input);
      const metadata = await image.metadata();
      // produce full-size webp at good quality (no enlargement)
      await image.webp({ quality: 80 }).toFile(path.join(dir, `${base}.webp`));
      // produce responsive sizes (no upscaling)
      for (const w of SIZES) {
        if (metadata.width && metadata.width < w) continue;
        await sharp(input)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(dir, `${base}-${w}.webp`));
      }
      console.log('Converted', input);
    } catch (err) {
      console.error('Error converting', input, err.message);
    }
  }
  console.log('Done.');
})();
