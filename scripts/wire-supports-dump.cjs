// Generate supports fixes scoped to each level in each file
// Output a list of find-replace pairs that we can apply with the edit tool
const { getLevelConfig } = require('../src/levels/levelLoader.js');
const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');

function computeSupports(obstacles) {
  const blocks = (obstacles || []).filter(o => o.blockType);
  const supportMap = {};
  for (const b of blocks) supportMap[b.id] = [];
  for (const upper of blocks) {
    for (const lower of blocks) {
      if (upper.id === lower.id) continue;
      if (Math.abs(upper.y - (lower.y + lower.height)) < 0.05) {
        if (upper.x < lower.x + lower.width && upper.x + upper.width > lower.x) {
          if (!supportMap[lower.id].includes(upper.id)) supportMap[lower.id].push(upper.id);
        }
      }
    }
  }
  return supportMap;
}

// Group levels by chapter file
const byFile = {};
for (let i = 0; i < 75; i++) {
  const cfg = getLevelConfig(i);
  if (!cfg) continue;
  const fn = `chapter${cfg.chapter}.js`;
  if (!byFile[fn]) byFile[fn] = [];
  
  const supportMap = computeSupports(cfg.obstacles);
  
  // Find supports that need changing
  const fixes = [];
  for (const obs of (cfg.obstacles || [])) {
    if (!obs.blockType) continue;
    const oldS = obs.supports || [];
    const newS = supportMap[obs.id] || [];
    if (JSON.stringify(oldS) !== JSON.stringify(newS)) {
      fixes.push({ levelId: cfg.id, blockId: obs.id, old: oldS, new: newS });
    }
  }
  
  // Find targets needing restingOn
  for (const t of (cfg.targets || [])) {
    if (t.restingOn) continue;
    for (const obs of (cfg.obstacles || [])) {
      if (!obs.blockType) continue;
      if (Math.abs(t.y - (obs.y + obs.height)) < 0.3) {
        if (t.x >= obs.x - 0.2 && t.x <= obs.x + obs.width + 0.2) {
          fixes.push({ levelId: cfg.id, targetId: t.id, restingOn: obs.id });
          break;
        }
      }
    }
  }
  
  if (fixes.length) byFile[fn].push({ levelId: cfg.id, fixes });
}

// Now generate actual file edits by finding unique strings per level
for (const [fn, levels] of Object.entries(byFile)) {
  const filePath = path.join(chaptersDir, fn);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n=== ${fn} ===`);
  
  for (const { levelId, fixes } of levels) {
    // Find this level's boundaries
    const levelStart = content.indexOf(`id: '${levelId}'`);
    if (levelStart === -1) { console.log(`  SKIP ${levelId}: not found`); continue; }
    
    // Find end: next level id or end of array
    let levelEnd = content.length;
    const afterStart = content.substring(levelStart + 5);
    const nextLevel = afterStart.match(/\nid:\s*'ch\d+-l\d+'/);
    if (nextLevel) levelEnd = levelStart + 5 + nextLevel.index;
    
    const levelText = content.substring(levelStart, levelEnd);
    
    for (const fix of fixes) {
      if (fix.blockId) {
        // Find the exact line with this block's supports
        const blockPattern = new RegExp(`id:\\s*'${fix.blockId}'[^}]*?supports:\\s*\\[([^\\]]*)\\]`, 's');
        const match = blockPattern.exec(levelText);
        if (match) {
          const oldStr = match[0];
          const newStr = oldStr.replace(/supports:\s*\[[^\]]*\]/, `supports: ${JSON.stringify(fix.new)}`);
          console.log(`  ${levelId} ${fix.blockId}: supports: [${match[1]}] -> ${JSON.stringify(fix.new)}`);
          // Output the unique string for replacement
          console.log(`    OLD: supports: [${match[1]}]`);
          console.log(`    NEW: supports: ${JSON.stringify(fix.new)}`);
        } else {
          console.log(`  SKIP ${levelId} ${fix.blockId}: pattern not found`);
        }
      } else if (fix.targetId) {
        console.log(`  ${levelId} target ${fix.targetId}: add restingOn: '${fix.restingOn}'`);
      }
    }
  }
}
