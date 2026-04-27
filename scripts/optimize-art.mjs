// Remove background from character PNGs (make near-white pixels transparent)
// Then resize and convert to WebP
import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';

const SRC = 'src/assets';
const files = await readdir(SRC);
const pngs = files.filter(f => f.endsWith('.png'));

let totalBefore = 0, totalAfter = 0;

for (const file of pngs) {
  const srcPath = join(SRC, file);
  const { name } = parse(file);
  const dstPath = join(SRC, `${name}.webp`);
  const isBg = name.startsWith('bg_');

  const beforeStat = await import('fs').then(m => m.promises.stat(srcPath));
  totalBefore += beforeStat.size;

  if (isBg) {
    // Backgrounds: resize to 1400×840, opaque
    await sharp(srcPath)
      .resize(1400, 840, { fit: 'fill' })
      .flatten({ background: { r: 0, g: 0, b: 0 } })
      .webp({ quality: 85 })
      .toFile(dstPath);
  } else {
    // Characters/targets: ensure alpha, remove background, resize
    let pipeline = sharp(srcPath).ensureAlpha();
    
    // Check if original has alpha — if not, remove near-white bg
    const meta = await sharp(srcPath).metadata();
    if (!meta.hasAlpha) {
      // Get raw pixels, make near-white transparent
      const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        // If pixel is near-white (all channels > 240), make it transparent
        if (r > 240 && g > 240 && b > 240) {
          data[i+3] = 0; // set alpha to 0
        }
      }
      // Create new image from modified raw data
      pipeline = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
    }
    
    // Resize and convert
    await pipeline
      .resize(null, 200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, alphaQuality: 90 })
      .toFile(dstPath);
  }

  const afterStat = await import('fs').then(m => m.promises.stat(dstPath));
  totalAfter += afterStat.size;

  const pct = Math.round((1 - afterStat.size / beforeStat.size) * 100);
  console.log(`${file} → ${name}.webp  ${Math.round(beforeStat.size/1024)}KB → ${Math.round(afterStat.size/1024)}KB  (-${pct}%)`);
}

// Remove PNGs
for (const file of pngs) {
  await unlink(join(SRC, file));
  console.log(`Removed ${file}`);
}

console.log(`\nTotal: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB  (-${Math.round((1 - totalAfter/totalBefore)*100)}%)`);
