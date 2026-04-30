// Fix default k values for all levels where k is in activeCoefficients
const fs = require('fs');
const path = require('path');
const { getLevelConfig } = require('../src/levels/levelLoader.js');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');
let totalFixes = 0;

for (let ch = 1; ch <= 8; ch++) {
  const filePath = path.join(chaptersDir, `chapter${ch}.js`);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (let li = 0; li < 10; li++) {
    const levelIdx = (ch - 1) * 10 + li;
    const cfg = getLevelConfig(levelIdx);
    if (!cfg) continue;
    
    const activeCoeffs = cfg.activeCoefficients || [];
    if (!activeCoeffs.includes('k')) continue;
    
    const form = cfg.equationForm;
    if (form !== 'vertex' && form !== 'stretch') continue;
    
    const p = cfg.defaultParams;
    const correctK = -(p.a || 0) * (p.h || 0) * (p.h || 0);
    if (Math.abs((p.k || 0) - correctK) < 0.01) continue;
    
    const oldK = p.k;
    
    // Find this level's defaultParams in the file
    const levelMarker = `id: '${cfg.id}'`;
    const levelStart = content.indexOf(levelMarker);
    if (levelStart === -1) continue;
    
    // Find end of this level
    let searchFrom = levelStart + levelMarker.length;
    let levelEnd = content.length;
    for (let nl = li + 1; nl < 10; nl++) {
      const nextId = `ch${ch}-l${nl + 1}`;
      const nextIdx = content.indexOf(`id: '${nextId}'`, searchFrom);
      if (nextIdx !== -1) { levelEnd = nextIdx; break; }
    }
    
    const levelText = content.substring(levelStart, levelEnd);
    
    // Find defaultParams: { a: ..., h: ..., k: 0 }
    // Need to find k value in defaultParams after this level id
    const dpMatch = /defaultParams:\s*\{[^}]*k:\s*([-\d.]+)/.exec(levelText);
    if (!dpMatch) { console.log(`  SKIP ${cfg.id}: defaultParams pattern not found`); continue; }
    
    const oldKStr = dpMatch[1];
    const newKStr = correctK.toFixed(4).replace(/\.?0+$/, ''); // trim trailing zeros
    
    // Replace just the k value in defaultParams
    const dpFullMatch = dpMatch[0];
    const newDpFull = dpFullMatch.replace(/k:\s*[-\d.]+/, `k: ${newKStr}`);
    
    // But we need to replace in the full content, not just levelText
    // Find the exact position
    const dpPos = content.indexOf(dpFullMatch, levelStart);
    if (dpPos === -1 || dpPos > levelEnd) { console.log(`  SKIP ${cfg.id}: couldn't locate defaultParams`); continue; }
    
    content = content.substring(0, dpPos) + newDpFull + content.substring(dpPos + dpFullMatch.length);
    changed = true;
    totalFixes++;
    console.log(`  ${cfg.id}: k: ${oldKStr} -> ${newKStr}`);
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Wrote chapter${ch}.js`);
  }
}

console.log(`\nTotal default k fixes: ${totalFixes}`);
