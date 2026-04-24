const KEY = 'happynerds_v1';

const DEFAULTS = {
  stars: [],          // number[] indexed by global level index (0-74)
  revealsSeen: [],    // string[] of conceptIds already shown
  unlocked: false,    // premium unlock
  currentLevel: 0,   // last level played
  volume: 70,         // master volume 0-100
  muted: false,       // mute toggle
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

export function isChapterProgressionUnlocked(chapterNum, progress, chapters) {
  if (chapterNum === 1) return true;
  const prevCh = chapters.find(ch => ch.num === chapterNum - 1);
  if (!prevCh) return true;
  let offset = 0;
  for (const ch of chapters) {
    if (ch.num === chapterNum - 1) break;
    offset += ch.levels.length;
  }
  for (let i = 0; i < prevCh.levels.length; i++) {
    if ((progress.stars[offset + i] ?? 0) < 1) return false;
  }
  return true;
}
