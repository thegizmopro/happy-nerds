// Apply supports + restingOn fixes using precise level-id scoped replacements
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

// First, git checkout the chapter files to undo the bad changes
const { execSync } = require('child_process');
console.log('Resetting chapter files...');
execSync('git checkout -- src/levels/chapters/', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

// Re-apply the k-parameter fixes that were done earlier
console.log('\nRe-applying k-parameter fixes...');
for (let i = 0; i < 75; i++) {
  const cfg = getLevelConfig(i);
  if (!cfg) continue;
  
  const supportMap = computeSupports(cfg.obstacles);
  
  // Find which file this level is in
  const chapterNum = cfg.chapter;
  const filePath = path.join(chaptersDir, `chapter${chapterNum}.js`);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find this level's section in the file
  const levelStart = content.indexOf(`id: '${cfg.id}'`);
  if (levelStart === -1) continue;
  
  // Find the end of this level (next level start or end of array)
  let levelEnd = content.length;
  const nextLevelMatch = content.substring(levelStart + 10).match(/id:\s*'ch\d+-l\d+'/);
  if (nextLevelMatch) {
    levelEnd = levelStart + 10 + nextLevelMatch.index;
    // Back up to the opening { of the next level
    const beforeNext = content.lastIndexOf('{', levelEnd);
    if (beforeNext > levelStart) levelEnd = beforeNext;
  }
  
  const levelContent = content.substring(levelStart, levelEnd);
  let newLevelContent = levelContent;
  
  // Fix supports for each block
  for (const obs of (cfg.obstacles || [])) {
    if (!obs.blockType) continue;
    const newSupports = supportMap[obs.id] || [];
    const oldSupports = obs.supports || [];
    
    if (JSON.stringify(oldSupports) === JSON.stringify(newSupports)) continue;
    
    // Find this block's supports within the level content
    const escapedId = obs.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const blockPattern = new RegExp(`id:\\s*'${escapedId}'`, 'g');
    let blockMatch;
    
    while ((blockMatch = blockPattern.exec(newLevelContent)) !== null) {
      // Find the next supports: [...] after this id
      const afterBlock = newLevelContent.substring(blockMatch.index);
      const supportsMatch = /supports:\s*\[[^\]]*\]/.exec(afterBlock);
      if (!supportsMatch) continue;
      
      // Make sure no other id: between our id and this supports
      const between = afterBlock.substring(0, supportsMatch.index);
      const otherIds = between.match(/id:\s*'/g);
      if (otherIds && otherIds.length > 1) continue;
      
      const newStr = `supports: ${JSON.stringify(newSupports)}`;
      newLevelContent = newLevelContent.substring(0, blockMatch.index + supportsMatch.index) + newStr + newLevelContent.substring(blockMatch.index + supportsMatch.index + supportsMatch[0].length);
      break; // Only replace first occurrence per level
    }
  }
  
  // Fix restingOn for targets
  for (const t of (cfg.targets || [])) {
    if (t.restingOn) continue;
    
    // Find target's resting position
    let restingOn = null;
    for (const obs of (cfg.obstacles || [])) {
      if (!obs.blockType) continue;
      if (Math.abs(t.y - (obs.y + obs.height)) < 0.3) {
        if (t.x >= obs.x - 0.2 && t.x <= obs.x + obs.width + 0.2) {
          restingOn = obs.id;
          break;
        }
      }
    }
    if (!restingOn) continue;
    
    // Add restingOn to target in level content
    const escapedTid = t.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Find the target and add restingOn before its closing }
    const targetPattern = new RegExp(`(id:\\s*'${escapedTid}'[^}]*?moving:\\s*(?:null|\\{[^}]*\\})\\s*,)`);
    const targetMatch = targetPattern.exec(newLevelContent);
    if (targetMatch) {
      const insertPos = targetMatch.index + targetMatch[0].length;
      newLevelContent = newLevelContent.substring(0, insertPos) + `\n      restingOn: '${restingOn}',` + newLevelContent.substring(insertPos);
      console.log(`  ${cfg.id}: target ${t.id} -> restingOn: '${restingOn}'`);
    }
  }
  
  if (newLevelContent !== levelContent) {
    content = content.substring(0, levelStart) + newLevelContent + content.substring(levelEnd);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${cfg.id}`);
  }
}

console.log('\nDone!');
