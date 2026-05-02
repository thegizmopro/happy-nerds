const fs = require('fs');
let src = fs.readFileSync('level-designer.html', 'utf8');

// 1. Add GROUND_Y constant after WW/WH
src = src.replace(
  'const WW = 10, WH = 6;',
  'const WW = 10, WH = 6;\nconst GROUND_Y = 0.6;  // Game ground level'
);

// 2. Update drawGround to show ground at GROUND_Y
src = src.replace(
  `function drawGround() {
  const {cx:x0,cy}=w2c(0,0), {cx:x1}=w2c(WW,0);
  ctx.strokeStyle='#65a30d'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x0,cy); ctx.lineTo(x1,cy); ctx.stroke();
}`,
  `function drawGround() {
  const {cx:x0,cy}=w2c(0,GROUND_Y), {cx:x1}=w2c(WW,GROUND_Y);
  // Ground fill below
  const {cy:bot}=w2c(0,0);
  ctx.fillStyle='#2d1a0a';
  ctx.fillRect(x0, cy, x1-x0, bot-cy+2);
  // Ground line
  ctx.strokeStyle='#65a30d'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x0,cy); ctx.lineTo(x1,cy); ctx.stroke();
  // Label
  ctx.fillStyle='#65a30d'; ctx.font='10px monospace';
  ctx.fillText('ground (y=0.6)', x0+4, cy-3);
}`
);

// 3. Update the snap function to snap y to GROUND_Y when placing obstacles near ground
// Find placeItem and add ground snapping for obstacles
src = src.replace(
  `    const o={id:\`obs_\${n}\`, x:wx, y:wy, width:bw, height:bh,
      blockType:palette==='wall'?null:palette,
      hp:palette==='wall'?null:parseInt(document.getElementById('nHp').value)||1,
      supports:[]};`,
  `    // Snap to ground if bottom edge is near ground level
    let placeY = wy;
    if (wy >= 0 && wy <= GROUND_Y + 0.2) placeY = GROUND_Y;
    // Auto HP by block type
    const autoHP = {glass:1, wood:2, concrete:2, stone:3};
    const o={id:\`obs_\${n}\`, x:wx, y:placeY, width:bw, height:bh,
      blockType:palette==='wall'?null:palette,
      hp:palette==='wall'?null:parseInt(document.getElementById('nHp').value)||autoHP[palette]||1,
      supports:[]};`
);

// 4. Update target placement to snap to ground
src = src.replace(
  `    const t={id:\`pig_\${n}\`, x:wx, y:wy,
      radius:parseFloat(document.getElementById('nRadius').value)||0.45,
      pigType:document.getElementById('nPigType').value,
      hp:parseInt(document.getElementById('nTHp').value)||1,
      moving:null, restingOn:null};`,
  `    let placeY = wy;
    if (wy >= 0 && wy <= GROUND_Y + 0.2) placeY = GROUND_Y;
    const t={id:\`pig_\${n}\`, x:wx, y:placeY,
      radius:parseFloat(document.getElementById('nRadius').value)||0.45,
      pigType:document.getElementById('nPigType').value,
      hp:parseInt(document.getElementById('nTHp').value)||1,
      moving:null, restingOn:null};`
);

// 5. When switching palette, auto-set HP input to match block type
src = src.replace(
  `function setPalette(p) {
  palette=p;`,
  `function setPalette(p) {
  palette=p;
  // Auto-set HP default based on block type
  const autoHP = {glass:1, wood:2, concrete:2, stone:3};
  if (autoHP[p]) document.getElementById('nHp').value = autoHP[p];`
);

// 6. Update the preview to show ground snap
src = src.replace(
  `function drawPreview() {
  if(previewWX===null) return;
  const sx=snap(previewWX), sy=snap(previewWY);`,
  `function drawPreview() {
  if(previewWX===null) return;
  const sx=snap(previewWX);
  let sy=snap(previewWY);
  // Show ground snap indicator
  if(sy >= 0 && sy <= GROUND_Y + 0.2) sy = GROUND_Y;`
);

fs.writeFileSync('level-designer.html', src, 'utf8');
console.log('Updated level designer with ground level and auto-HP defaults');
