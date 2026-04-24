// Pure function — no side effects.
// starThresholds: [movesFor3Star, movesFor2Star]
// starMode: 'moves' | 'bonus'
// bonusAchieved: boolean (only relevant in 'bonus' mode)
export function calcStars({ sliderMoves, starThresholds, starMode, bonusAchieved }) {
  if (starMode === 'bonus') {
    if (bonusAchieved) return 3;
    const [, t2] = starThresholds;
    return sliderMoves <= t2 ? 2 : 1;
  }
  const [t3, t2] = starThresholds;
  if (sliderMoves <= t3) return 3;
  if (sliderMoves <= t2) return 2;
  return 1;
}

export function starStr(n, total = 3) {
  return '★'.repeat(n) + '☆'.repeat(total - n);
}
