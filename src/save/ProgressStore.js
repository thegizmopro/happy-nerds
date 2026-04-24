const KEY = 'happynerds_v1';

const DEFAULTS = {
  stars: [],          // number[] indexed by global level index (0-74)
  revealsSeen: [],    // string[] of conceptIds already shown
  unlocked: false,    // premium unlock
  currentLevel: 0,   // last level played
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const data = JSON.parse(raw);
    return { ...DEFAULTS, ...data };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function recordStar(progress, levelIndex, stars) {
  const cur = progress.stars[levelIndex] ?? 0;
  progress.stars[levelIndex] = Math.max(cur, stars);
  progress.currentLevel = Math.max(progress.currentLevel, levelIndex);
  saveProgress(progress);
}

export function markRevealSeen(progress, conceptId) {
  if (!progress.revealsSeen.includes(conceptId)) {
    progress.revealsSeen.push(conceptId);
    saveProgress(progress);
  }
}

export function getStars(progress, levelIndex) {
  return progress.stars[levelIndex] ?? 0;
}

export function isChapterUnlocked(chapterNum, progress) {
  const { PREMIUM_CHAPTER_START } = { PREMIUM_CHAPTER_START: 4 };
  if (chapterNum < PREMIUM_CHAPTER_START) return true;
  return progress.unlocked;
}
