// Resize and optimize all game sprites
// Backgrounds → 1400×840 WebP (2x display size)
// Characters/targets → max 200px height WebP (4x display size)
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const SRC = 'src/assets';
const OUT = 'src/assets'; // overwrite in place

const files = await readdir(SRC);
const pngs = files.filter(f => f.endsWith('.png'));

let totalBefore = 0, totalAfter = 0;

for (const file of pngs) {
  const srcPath = join(SRC, file);
  const { name } = parse(file);
  const dstPath = join(OUT, `${name}.webp`);
  
  const meta = await sharp(srcPath).metadata();
  const isBg = name.startsWith('bg_');
  
  let pipeline = sharp(srcPath);
  
  if (isBg) {
    // Backgrounds: resize to 1400×840
    pipeline = pipeline.resize(1400, 840, { fit: 'fill' });
  } else {
    // Characters/targets: max height 200px, keep aspect ratio
    pipeline = pipeline.resize(null, 200, { fit: 'inside', withoutEnlargement: true });
  }
  
  pipeline = pipeline.webp({ quality: 85 });
  
  const before = (await sharp(srcPath).metadata()).size || 0;
  totalBefore += before;
  
  await pipeline.toFile(dstPath);
  
  const stat = await import('fs').then(m => m.promises.stat(dstPath));
  totalAfter += stat.size;
  
  const pct = before ? Math.round((1 - stat.size / before) * 100) : 0;
  console.log(`${file} → ${name}.webp  ${Math.round(before/1024)}KB → ${Math.round(stat.size/1024)}KB  (-${pct}%)`);
}

console.log(`\nTotal: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB  (-${Math.round((1 - totalAfter/totalBefore)*100)}%)`);
