const fs = require('fs');

// Add bonusShots to Ch4-Ch8 single-shot levels that don't have multiShot or bonusShots
for (let ch = 4; ch <= 8; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');
  let count = 0;

  // Find each level block
  const licRegex = /levelInChapter: (\d+),/g;
  let match;

  // Collect level positions
  const levels = [];
  while ((match = licRegex.exec(src)) !== null) {
    levels.push({ licNum: parseInt(match[1]), startIdx: match.index });
  }

  // Process in reverse order to preserve indices
  for (let i = levels.length - 1; i >= 0; i--) {
    const { licNum, startIdx } = levels[i];
    const nextStart = i < levels.length - 1 ? levels[i + 1].startIdx : src.length;
    const section = src.substring(startIdx, nextStart);

    // Skip if already has bonusShots or multiShot
    if (section.includes('bonusShots:') || section.includes('multiShot:')) continue;

    // Find starThresholds and add bonusShots before it
    const stIdx = src.indexOf('starThresholds:', startIdx);
    if (stIdx === -1 || stIdx > nextStart) continue;

    const insertLine = '    bonusShots: 1,\n    ';
    src = src.substring(0, stIdx) + insertLine + src.substring(stIdx);
    count++;
  }

  fs.writeFileSync(file, src, 'utf8');
  console.log('ch' + ch + ': added bonusShots to ' + count + ' single-shot levels');
}

console.log('Done!');
