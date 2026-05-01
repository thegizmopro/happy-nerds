const fs = require('fs');

// Updated map with unique reveal IDs per chapter
const REVEAL_MAP = {
  1: { 1: 'what_is_a_function', 3: 'leading_coefficient', 5: 'wider_vs_narrower', 8: 'real_world_parabolas' },
  2: { 3: 'vertex_form', 5: 'horizontal_shift', 8: 'vertex_hunting', 10: 'symmetry' },
  3: { 1: 'negative_a_intro', 5: 'negative_a', 8: 'domain_and_range' },
  4: { 1: 'factored_form', 5: 'roots_and_zeros', 7: 'multiple_roots', 10: 'discriminant' },
  5: { 1: 'standard_form', 4: 'vertex_to_factored', 6: 'completing_the_square', 9: 'accuracy_and_efficiency' },
  6: { 1: 'multi_shot_strategy', 4: 'combining_functions', 8: 'precision_matters' },
  7: { 1: 'cubic_intro', 5: 'piecewise_intro', 7: 'absolute_value_intro', 10: 'function_transformations' },
  8: { 2: 'math_mastery', 5: 'strategic_thinking' },
};

for (let ch = 1; ch <= 8; ch++) {
  const file = 'src/levels/chapters/chapter' + ch + '.js';
  let src = fs.readFileSync(file, 'utf8');
  const map = REVEAL_MAP[ch];
  if (!map) continue;

  for (const [lic, revealId] of Object.entries(map)) {
    const licNum = parseInt(lic);
    const licPattern = 'levelInChapter: ' + licNum;
    const licIdx = src.indexOf(licPattern);
    if (licIdx === -1) { console.log('WARN: ch' + ch + ' L' + licNum + ' not found'); continue; }

    const raIdx = src.indexOf('revealAfter:', licIdx);
    if (raIdx === -1) { console.log('WARN: ch' + ch + ' L' + licNum + ' no revealAfter'); continue; }

    const nextLic = src.indexOf('levelInChapter:', licIdx + licPattern.length);
    if (nextLic !== -1 && raIdx > nextLic) { console.log('WARN: ch' + ch + ' L' + licNum + ' revealAfter beyond next level'); continue; }

    const lineEnd = src.indexOf('\n', raIdx);
    const newLine = "revealAfter: '" + revealId + "',";
    src = src.substring(0, raIdx) + newLine + src.substring(lineEnd);
    console.log('ch' + ch + ' L' + licNum + ' -> ' + revealId);
  }

  fs.writeFileSync(file, src, 'utf8');
}
console.log('Done!');
