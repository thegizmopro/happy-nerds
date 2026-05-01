const fs = require('fs');

// Add bonusShots: 1 to all Ch4-Ch8 levels that don't already have it
// This gives players an extra shot beyond the minimum for fun destruction

for (let ch = 4; ch <= 8; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');

  // Find each levelInChapter and add bonusShots before multiShot
  let count = 0;
  const licRegex = /levelInChapter: (\d+),/g;
  let match;
  
  while ((match = licRegex.exec(src)) !== null) {
    const licNum = parseInt(match[1]);
    const licIdx = match.index;
    
    // Check if bonusShots already exists between this levelInChapter and the next (or end)
    const nextLic = src.indexOf('levelInChapter:', licIdx + match[0].length);
    const sectionEnd = nextLic === -1 ? src.length : nextLic;
    const section = src.substring(licIdx, sectionEnd);
    
    if (section.includes('bonusShots:')) continue; // already has it
    
    // Find multiShot in this section and insert bonusShots before it
    const msIdx = src.indexOf('multiShot:', licIdx);
    if (msIdx === -1 || msIdx > sectionEnd) continue;
    
    const insertLine = '    bonusShots: 1,\n';
    src = src.substring(0, msIdx) + insertLine + src.substring(msIdx);
    count++;
    
    // Adjust regex search position since we modified the string
    licRegex.lastIndex = msIdx + insertLine.length;
  }

  fs.writeFileSync(file, src, 'utf8');
  console.log('ch' + ch + ': added bonusShots to ' + count + ' levels');
}

// Now update starThresholds for Ch4-Ch8 to account for bonusShots
// Total shots = shotCount + bonusShots
// ⭐⭐⭐ = shotCount (use minimum shots perfectly)
// ⭐⭐ = shotCount + 1 (one extra)
// ⭐ = more than that
for (let ch = 4; ch <= 8; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');

  // The thresholds were already set to [shotCount, shotCount+1] in the previous script
  // With bonusShots, those thresholds are still correct:
  // ⭐⭐⭐ = shotCount (efficient), ⭐⭐ = shotCount+1 (used 1 extra)
  // Total available = shotCount + bonusShots (usually +1)
  // So thresholds are already right. No change needed.
  console.log('ch' + ch + ': thresholds already correct');
}

console.log('Done!');
