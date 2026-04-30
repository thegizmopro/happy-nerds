// Convert all blockType: 'stone' to blockType: 'concrete', hp: 2
// Stone is now indestructible (permanent walls only).
// Concrete is the destructible version (2 hits to break).
const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, '..', 'src', 'levels', 'chapters');
let totalConverts = 0;

for (let ch = 1; ch <= 8; ch++) {
  const filePath = path.join(chaptersDir, `chapter${ch}.js`);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace blockType: 'stone', hp: 3 → blockType: 'concrete', hp: 2
  content = content.replace(/blockType:\s*'stone',\s*hp:\s*3/g, "blockType: 'concrete', hp: 2");
  
  // Also update ids that say 'stone' in the block definition — rename to concrete
  // e.g. { id: 'stone_col_l', ... blockType: 'concrete' ... }
  // Keep the ids as-is for now (stone_col_l is fine as a name, just the material changes)
  
  const count = (original.match(/blockType:\s*'stone',\s*hp:\s*3/g) || []).length;
  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`chapter${ch}.js: converted ${count} stone → concrete`);
    totalConverts += count;
  }
}

console.log(`\nTotal conversions: ${totalConverts}`);
