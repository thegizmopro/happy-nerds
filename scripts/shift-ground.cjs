// Shift all level y-coordinates down by 0.6 to match new GROUND_Y = 0
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'levels', 'chapters');
const SHIFT = 0.6;

function shiftVal(v) {
  if (typeof v !== 'number') return v;
  const shifted = Math.round((v - SHIFT) * 100) / 100;
  return shifted < 0 ? 0 : shifted;
}

for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const fp = path.join(dir, file);
  let src = fs.readFileSync(fp, 'utf8');
  let changes = 0;

  // Match patterns like y: 0.6, y:2.4, y: 1.7 etc in level definitions
  // We need to be careful to only shift y values in objects, not comments or strings
  src = src.replace(/(\by:\s*)([\d.]+)/g, (match, prefix, numStr) => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return match;
    const shifted = shiftVal(num);
    if (shifted !== num) {
      changes++;
      return `${prefix}${shifted}`;
    }
    return match;
  });

  // Also shift radius and height values that are relative
  // height values should stay the same (they're spans, not positions)
  // radius should stay the same
  // But launcher.y needs shifting
  // bonusRing.y needs shifting
  // target y already handled above
  // obstacle y already handled above
  
  if (changes > 0) {
    fs.writeFileSync(fp, src, 'utf8');
    console.log(`${file}: shifted ${changes} y-values`);
  } else {
    console.log(`${file}: no changes`);
  }
}
