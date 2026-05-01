const fs = require('fs');

// Add bonusShots to Ch1-Ch3 levels and update starThresholds for shot-based scoring
// Star logic: ⭐⭐⭐ = minShots, ⭐⭐ = minShots+1, ⭐ = all used
// For single-shot levels with 1 bonus shot: totalShots=2, thresholds=[1,2]
// For single-shot levels with 0 bonus shots: totalShots=1, thresholds=[1,1]

const BONUS_MAP = {
  1: { 1: 0, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0, 9: 1, 10: 1 },
  2: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 0 },
  3: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 0, 10: 1 },
};

for (let ch = 1; ch <= 3; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');
  const map = BONUS_MAP[ch];

  for (const [lic, bonusShots] of Object.entries(map)) {
    const licNum = parseInt(lic);
    const licPattern = 'levelInChapter: ' + licNum;
    const licIdx = src.indexOf(licPattern);
    if (licIdx === -1) { console.log('WARN: ch' + ch + ' L' + licNum + ' not found'); continue; }

    // Find the next closing brace for this level object
    // We'll insert bonusShots right before starThresholds
    const stIdx = src.indexOf('starThresholds:', licIdx);
    if (stIdx === -1) { console.log('WARN: ch' + ch + ' L' + licNum + ' no starThresholds'); continue; }
    const nextLic = src.indexOf('levelInChapter:', licIdx + licPattern.length);
    if (nextLic !== -1 && stIdx > nextLic) { console.log('WARN: ch' + ch + ' L' + licNum + ' starThresholds beyond next level'); continue; }

    // Add bonusShots field before starThresholds
    const insertPoint = stIdx;
    const bonusLine = '    bonusShots: ' + bonusShots + ',\n    ';
    src = src.substring(0, insertPoint) + bonusLine + src.substring(insertPoint);

    // Update starThresholds for shot-based scoring
    // ⭐⭐⭐ = 1 shot (minimum), ⭐⭐ = 2 shots
    const totalShots = 1 + bonusShots;
    const t3 = 1; // 3 stars for 1 shot
    const t2 = Math.min(totalShots, 2); // 2 stars for 2 shots (or 1 if no bonus)

    // Replace starThresholds value
    const stLineEnd = src.indexOf('\n', insertPoint + bonusLine.length);
    const stLine = src.substring(insertPoint + bonusLine.length, stLineEnd);
    const newStLine = stLine.replace(/starThresholds: \[[\d,\s]+\]/, 'starThresholds: [' + t3 + ', ' + t2 + ']');
    src = src.substring(0, insertPoint + bonusLine.length) + newStLine + src.substring(stLineEnd);

    console.log('ch' + ch + ' L' + licNum + ' -> bonusShots=' + bonusShots + ', thresholds=[' + t3 + ',' + t2 + ']');
  }

  fs.writeFileSync(file, src, 'utf8');
}

// For Ch4-Ch8 (multiShot levels), update starThresholds to shot-based
// ⭐⭐⭐ = shotCount (minimum), ⭐⭐ = shotCount+1, ⭐ = all used
for (let ch = 4; ch <= 8; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');

  // Find all multiShot.shotCount values
  const shotCountRegex = /shotCount:\s*(\d+)/g;
  const shotCounts = [];
  let m;
  while ((m = shotCountRegex.exec(src)) !== null) {
    shotCounts.push(parseInt(m[1]));
  }

  // Find all starThresholds and update based on corresponding shotCount
  const stRegex = /starThresholds:\s*\[(\d+),\s*(\d+)\]/g;
  let shotIdx = 0;
  src = src.replace(stRegex, (match, t3, t2) => {
    const sc = shotCounts[shotIdx] || 2;
    shotIdx++;
    const newT3 = sc;       // ⭐⭐⭐ = used all shots efficiently
    const newT2 = sc + 1;   // ⭐⭐ = used 1 extra
    console.log('ch' + ch + ' shotCount=' + sc + ' -> thresholds=[' + newT3 + ',' + newT2 + ']');
    return 'starThresholds: [' + newT3 + ', ' + newT2 + ']';
  });

  fs.writeFileSync(file, src, 'utf8');
}

console.log('Done!');
