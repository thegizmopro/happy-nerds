import sharp from 'sharp';

const { data, info } = await sharp('src/assets/carl_idle.webp').raw().toBuffer({ resolveWithObject: true });

let samples = [];
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
  if (a > 0 && a < 255) {
    samples.push({ r, g, b, a });
    if (samples.length >= 10) break;
  }
}
console.log('Semi-transparent pixels found:', samples.length);
samples.forEach(s => console.log('  RGBA:', s));

let transparent = 0, semi = 0, opaque = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i+3] === 0) transparent++;
  else if (data[i+3] < 255) semi++;
  else opaque++;
}
console.log('Transparent:', transparent, 'Semi-transparent:', semi, 'Opaque:', opaque);
