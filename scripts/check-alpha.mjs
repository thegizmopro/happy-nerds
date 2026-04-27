import sharp from 'sharp';
import { readdir } from 'fs/promises';

const files = (await readdir('src/assets')).filter(f => f.endsWith('.png'));
for (const f of files) {
  const meta = await sharp(`src/assets/${f}`).metadata();
  console.log(`${f}: alpha=${meta.hasAlpha} channels=${meta.channels} size=${meta.width}x${meta.height}`);
}
