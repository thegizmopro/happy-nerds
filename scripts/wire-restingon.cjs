// Add missing restingOn for targets that sit on top of blocks
const fs = require('fs');
const path = require('path');
const { getLevelConfig } = require('../src/levels/levelLoader.js');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');
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
    
    // Find this level's section
    const levelMarker = `id: '${cfg.id}'`;
    const levelStart = content.indexOf(levelMarker);
    if (levelStart === -1) continue;
    
    let searchFrom = levelStart + levelMarker.length;
    let levelEnd = content.length;
    for (let nl = li + 1; nl < 10; nl++) {
      const nextId = `ch${ch}-l${nl + 1}`;
      const nextIdx = content.indexOf(`id: '${nextId}'`, searchFrom);
      if (nextIdx !== -1) { levelEnd = nextIdx; break; }
    }
    
    const levelText = content.substring(levelStart, levelEnd);
    let newLevelText = levelText;
    
    for (const t of (cfg.targets || [])) {
      if (t.restingOn) continue;
      
      // Find what block this target sits on
      let restingOn = null;
      for (const obs of (cfg.obstacles || [])) {
        if (!obs.blockType) continue;
        // Target bottom should be near block top
        const tBottom = t.y;
        const obsTop = obs.y + obs.height;
        if (Math.abs(tBottom - obsTop) < 0.3) {
          if (t.x >= obs.x - 0.3 && t.x <= obs.x + obs.width + 0.3) {
            restingOn = obs.id;
            break;
          }
        }
      }
      if (!restingOn) continue;
      
      // Add restingOn to this target in the level text
      // Find target by its id, then add restingOn after moving: ... line
      const escapedTid = t.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Pattern: id: 'targetId', x: ..., y: ..., radius: ..., pigType: '...', hp: ..., moving: null,
      const targetPattern = new RegExp(
        `(id:\\s*'${escapedTid}',\\s*x:\\s*[\\d.]+,\\s*y:\\s*[\\d.]+,\\s*radius:\\s*[\\d.]+,\\s*pigType:\\s*'[^']+',\\s*hp:\\s*\\d+,\\s*moving:\\s*(?:null|\\{[^}]*\\})\\s*,)`
      );
      const match = targetPattern.exec(newLevelText);
      if (match) {
        const insert = `\n      restingOn: '${restingOn}',`;
        newLevelText = newLevelText.replace(match[0], match[0] + insert);
        totalChanges++;
        console.log(`  ${cfg.id}: target ${t.id} -> restingOn: '${restingOn}'`);
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

console.log(`\nTotal restingOn added: ${totalChanges}`);
