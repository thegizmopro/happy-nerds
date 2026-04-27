// Optimize game sprites: PNG → WebP with resize
// Characters/targets: max 200px height, preserve alpha
// Backgrounds: 1400×840, flatten to opaque (if present)
import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';

const SRC = 'src/assets';
const files = await readdir(SRC);
const pngs = files.filter(f => f.endsWith('.png'));

if (pngs.length === 0) { console.log('No PNGs to optimize'); process.exit(0); }

let totalBefore = 0, totalAfter = 0;

for (const file of pngs) {
  const srcPath = join(SRC, file);
  const { name } = parse(file);
  const dstPath = join(SRC, `${name}.webp`);
  const isBg = name.startsWith('bg_');

  const beforeStat = await import('fs').then(m => m.promises.stat(srcPath));
  totalBefore += beforeStat.size;

  if (isBg) {
    await sharp(srcPath)
      .resize(1400, 840, { fit: 'fill' })
      .flatten({ background: { r: 0, g: 0, b: 0 } })
      .webp({ quality: 85 })
      .toFile(dstPath);
  } else {
    // Characters/targets: preserve alpha, resize to max 200px height
    await sharp(srcPath)
      .resize(null, 200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, alphaQuality: 90 })
      .toFile(dstPath);
  }

  const afterStat = await import('fs').then(m => m.promises.stat(dstPath));
  totalAfter += afterStat.size;

  const pct = Math.round((1 - afterStat.size / beforeStat.size) * 100);
  console.log(`${file} → ${name}.webp  ${Math.round(beforeStat.size/1024)}KB → ${Math.round(afterStat.size/1024)}KB  (-${pct}%)`);

  // Remove the PNG
  await unlink(srcPath);
}

console.log(`\nTotal: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB  (-${Math.round((1 - totalAfter/totalBefore)*100)}%)`);
