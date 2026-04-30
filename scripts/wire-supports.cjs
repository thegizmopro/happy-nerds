// Apply supports + restingOn fixes to chapter files
const fs = require('fs');
const path = require('path');
const { getLevelConfig } = require('../src/levels/levelLoader.js');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');

function computeSupports(obstacles) {
  const blocks = (obstacles || []).filter(o => o.blockType);
  const supportMap = {};
  for (const b of blocks) supportMap[b.id] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (i === j) continue;
      const upper = blocks[i];
      const lower = blocks[j];
      if (Math.abs(upper.y - (lower.y + lower.height)) < 0.05) {
        if (upper.x < lower.x + lower.width && upper.x + upper.width > lower.x) {
          if (!supportMap[lower.id].includes(upper.id)) {
            supportMap[lower.id].push(upper.id);
          }
        }
      }
    }
  }
  return supportMap;
}

function computeTargetRestingOn(target, obstacles) {
  if (target.restingOn) return null;
  for (const obs of (obstacles || [])) {
    if (!obs.blockType) continue;
    if (Math.abs(target.y - (obs.y + obs.height)) < 0.3) {
      if (target.x >= obs.x - 0.2 && target.x <= obs.x + obs.width + 0.2) {
        return obs.id;
      }
    }
  }
  return null;
}

// For each chapter file, process all levels
const chapterFiles = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.js'));
let totalFixes = 0;

for (const file of chapterFiles) {
  const filePath = path.join(chaptersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanged = false;
  
  // Process each level
  for (let i = 0; i < 75; i++) {
    const cfg = getLevelConfig(i);
    if (!cfg || !cfg.id) continue;
    
    // Check if this level belongs to this file
    const levelIdPattern = cfg.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!content.includes(cfg.id)) continue;
    
    const supportMap = computeSupports(cfg.obstacles);
    
    // Fix supports arrays for each block
    for (const obs of (cfg.obstacles || [])) {
      if (!obs.blockType) continue;
      const newSupports = supportMap[obs.id] || [];
      const oldSupports = obs.supports || [];
      
      if (JSON.stringify(oldSupports) !== JSON.stringify(newSupports)) {
        // Find and replace supports: [...] for this block
        const escapedId = obs.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Pattern: id: 'blockId', ... supports: [...]
        // Find the block by its id, then find its supports array
        const idPattern = new RegExp(`id:\\s*'${escapedId}'`);
        const idMatch = idPattern.exec(content);
        if (!idMatch) continue;
        
        // Find the next supports: [...] after this id
        const afterId = content.substring(idMatch.index);
        const supportsPattern = /supports:\s*\[[^\]]*\]/;
        const supportsMatch = supportsPattern.exec(afterId);
        if (!supportsMatch) continue;
        
        // Make sure this supports belongs to this block (not another block between)
        // Check there's no other id: between our id and this supports
        const between = afterId.substring(0, supportsMatch.index);
        const otherIds = between.match(/id:\s*'/g);
        if (otherIds && otherIds.length > 1) continue; // Another block between our id and this supports
        
        const newSupportsStr = `supports: ${JSON.stringify(newSupports)}`;
        const absStart = idMatch.index + supportsMatch.index;
        const absEnd = absStart + supportsMatch[0].length;
        content = content.substring(0, absStart) + newSupportsStr + content.substring(absEnd);
        fileChanged = true;
        totalFixes++;
      }
    }
    
    // Fix restingOn for targets
    for (const t of (cfg.targets || [])) {
      const newRO = computeTargetRestingOn(t, cfg.obstacles);
      if (!newRO) continue;
      
      // Find target by id and add restingOn
      const escapedTid = t.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Find target definition - look for id: 'targetId' and add restingOn after moving: ...,
      const targetPattern = new RegExp(`(id:\\s*'${escapedTid}'[^}]*?)(moving:\\s*(?:null|\\{[^}]*\\})\\s*,)`, 's');
      // Actually simpler: just add restingOn before the closing }
      // Find the target object with this id
      const tidPattern = new RegExp(`id:\\s*'${escapedTid}'`);
      const tidMatch = tidPattern.exec(content);
      if (!tidMatch) continue;
      
      // Find the closing } for this target, but need to handle nested objects
      // Simpler: look for the pattern "radius: 0.45," or "hp: 1," and add restingOn after moving
      const afterTid = content.substring(tidMatch.index);
      
      // Check if restingOn already exists for this target
      const restingPattern = /restingOn:\s*['"]\w+['"]/;
      const beforeNextId = afterTid.substring(0, afterTid.indexOf('id:', 10) > 0 ? afterTid.indexOf('id:', 10) : 500);
      if (restingPattern.exec(beforeNextId)) continue; // already has restingOn
      
      // Add restingOn after moving: null (or moving: {...})
      const movingPattern = /moving:\s*(?:null|\\{[^}]*\\})\\s*,?/;
      // Actually, let's just add it before the closing of the target object
      // Find "hp: 1," or "hp: 2," and add after moving
      const insertPattern = new RegExp(`(id:\\s*'${escapedTid}'[^}]*?moving:\\s*(?:null|\\{[^}]*\\})\\s*,)`);
      const insertMatch = insertPattern.exec(content.substring(tidMatch.index));
      if (insertMatch) {
        const absPos = tidMatch.index + insertMatch.index + insertMatch[0].length;
        content = content.substring(0, absPos) + `\n      restingOn: '${newRO}',` + content.substring(absPos);
        fileChanged = true;
        totalFixes++;
        console.log(`  ${cfg.id}: target ${t.id} -> restingOn: '${newRO}'`);
      }
    }
  }
  
  if (fileChanged) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Wrote ${file}`);
  }
}

console.log(`\nTotal fixes: ${totalFixes}`);
