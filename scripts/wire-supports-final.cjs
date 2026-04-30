// Final wire-supports script: only fill in EMPTY supports arrays (non-empty ones are assumed correct)
// Uses level-scoped string matching for precision
const fs = require('fs');
const path = require('path');
const { getLevelConfig } = require('../src/levels/levelLoader.js');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');

function computeSupports(obstacles) {
  const blocks = (obstacles || []).filter(o => o.blockType);
  const supportMap = {};
  for (const b of blocks) supportMap[b.id] = [];
  for (const upper of blocks) {
    for (const lower of blocks) {
      if (upper.id === lower.id) continue;
      if (Math.abs(upper.y - (lower.y + lower.height)) < 0.05) {
        // Use <= for edge-touching blocks  
        if (upper.x <= lower.x + lower.width + 0.01 && upper.x + upper.width >= lower.x - 0.01) {
          if (!supportMap[lower.id].includes(upper.id)) supportMap[lower.id].push(upper.id);
        }
      }
    }
  }
  return supportMap;
}

let totalChanges = 0;

for (let ch = 1; ch <= 8; ch++) {
  const filePath = path.join(chaptersDir, `chapter${ch}.js`);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (let li = 0; li < 10; li++) {
    const levelIdx = (ch - 1) * 10 + li;
    const cfg = getLevelConfig(levelIdx);
    if (!cfg) continue;
    
    const supportMap = computeSupports(cfg.obstacles);
    
    // Find this level's section
    const levelMarker = `id: '${cfg.id}'`;
    const levelStart = content.indexOf(levelMarker);
    if (levelStart === -1) continue;
    
    // Find end of this level entry
    let searchFrom = levelStart + levelMarker.length;
    let levelEnd = content.length;
    for (let nl = li + 1; nl < 10; nl++) {
      const nextId = `ch${ch}-l${nl + 1}`;
      const nextIdx = content.indexOf(`id: '${nextId}'`, searchFrom);
      if (nextIdx !== -1) { levelEnd = nextIdx; break; }
    }
    
    const levelText = content.substring(levelStart, levelEnd);
    let newLevelText = levelText;
    
    for (const obs of (cfg.obstacles || [])) {
      if (!obs.blockType) continue;
      const currentSupports = obs.supports || [];
      const computedSupports = supportMap[obs.id] || [];
      
      // Only fix EMPTY supports
      if (currentSupports.length > 0) continue;
      if (computedSupports.length === 0) continue;
      
      // Find this block's supports: [] in the level text
      const escapedId = obs.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match: id: 'blockId', ... supports: []
      // We need to find this specific block within this level
      const pattern = new RegExp(
        `(id:\\s*'${escapedId}',\\s*x:\\s*[\\d.]+,\\s*y:\\s*[\\d.]+,\\s*width:\\s*[\\d.]+,\\s*height:\\s*[\\d.]+,\\s*blockType:\\s*'[^']+',\\s*hp:\\s*\\d+,\\s*)supports:\\s*\\[\\s*\\]`
      );
      const match = pattern.exec(newLevelText);
      if (match) {
        const replacement = match[0].replace(/supports:\s*\[\s*\]/, `supports: ${JSON.stringify(computedSupports)}`);
        newLevelText = newLevelText.replace(match[0], replacement);
        totalChanges++;
      }
    }
    
    if (newLevelText !== levelText) {
      content = content.substring(0, levelStart) + newLevelText + content.substring(levelEnd);
      changed = true;
      console.log(`Updated ${cfg.id}`);
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Wrote chapter${ch}.js`);
  }
}

console.log(`\nTotal empty supports filled: ${totalChanges}`);
