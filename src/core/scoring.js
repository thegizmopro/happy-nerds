// Pure function — no side effects.
// starThresholds: [shotsFor3Star, shotsFor2Star]
//   How many shots used to earn each star tier.
//   ⭐⭐⭐ = used shotsFor3Star or fewer
//   ⭐⭐ = used shotsFor2Star or fewer
//   ⭐ = completed (used more than shotsFor2Star)
// starMode: 'shots' | 'bonus'
// bonusAchieved: boolean (only relevant in 'bonus' mode)
export function calcStars({ shotsUsed, starThresholds, starMode, bonusAchieved }) {
  if (starMode === 'bonus') {
    if (bonusAchieved) return 3;
    const [, t2] = starThresholds;
    return shotsUsed <= t2 ? 2 : 1;
  }
  const [t3, t2] = starThresholds;
  if (shotsUsed <= t3) return 3;
  if (shotsUsed <= t2) return 2;
  return 1;
}

export function starStr(n, total = 3) {
  return '\u2605'.repeat(n) + '\u2606'.repeat(total - n);
}

// Scoring — points for destruction, accuracy, and efficiency.
// blockPoints: { glass: 500, wood: 1000, concrete: 1500, stone: 0 }
// targetKill: 5000 per target killed
// shotBonus: remaining shots * 3000 each
// sliderPenalty: -50 per slider move beyond 1
export function calcScore({
  blocksDestroyed = [],  // [{ blockType }]
  targetsKilled = 0,
  shotsUsed = 1,
  totalShots = 1,
  sliderMoves = 0,
}) {
  const BLOCK_PTS = { glass: 500, wood: 1000, concrete: 1500, stone: 0 };
  const TARGET_PTS = 5000;
  const SHOT_BONUS = 3000;
  const SLIDER_PENALTY = 50;

  let score = 0;

  // Block destruction points
  for (const b of blocksDestroyed) {
    score += BLOCK_PTS[b.blockType] ?? 0;
  }

  // Target kill points
  score += targetsKilled * TARGET_PTS;

  // Bonus for unused shots (encourages efficiency)
  const shotsRemaining = totalShots - shotsUsed;
  score += shotsRemaining * SHOT_BONUS;

  // Small penalty for excessive slider fiddling (first move is free)
  const excessMoves = Math.max(0, sliderMoves - 1);
  score -= excessMoves * SLIDER_PENALTY;

  return Math.max(0, score);
}
