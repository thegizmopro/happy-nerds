import { CHAPTER_1 } from './chapters/chapter1.js';
import { CHAPTER_2 } from './chapters/chapter2.js';
import { CHAPTER_3 } from './chapters/chapter3.js';
import { CHAPTER_4 } from './chapters/chapter4.js';
import { CHAPTER_5 } from './chapters/chapter5.js';
import { CHAPTER_6 } from './chapters/chapter6.js';
import { CHAPTER_7 } from './chapters/chapter7.js';
import { CHAPTER_8 } from './chapters/chapter8.js';
import { isChapterProgressionUnlocked } from '../save/ProgressStore.js';

export const PREMIUM_CHAPTERS = [4, 5, 6, 7];

export const CHAPTERS = [
  { num: 1, title: 'Stretch',          concept: 'y = ax²',                  levels: CHAPTER_1 },
  { num: 2, title: 'Shift',            concept: 'y = a(x−h)² + k',          levels: CHAPTER_2 },
  { num: 3, title: 'Sign & Shape',     concept: 'Positive vs. negative a',  levels: CHAPTER_3 },
  { num: 4, title: 'Roots',            concept: 'y = a(x−r₁)(x−r₂)',        levels: CHAPTER_4 },
  { num: 5, title: 'Standard Form',   concept: 'y = ax² + bx + c',         levels: CHAPTER_5 },
  { num: 6, title: 'Multi-Shot',       concept: 'Multiple projectiles',      levels: CHAPTER_6 },
  { num: 7, title: 'Beyond Quadratics',concept: 'Cubic, abs, piecewise',    levels: CHAPTER_7 },
  { num: 8, title: 'The Final Exam',  concept: 'Boss levels — timed',       levels: CHAPTER_8 },
];

// Flat array of all levels in order (global index 0-74)
export const ALL_LEVELS = CHAPTERS.flatMap(ch => ch.levels);

export function getLevelConfig(globalIndex) {
  return ALL_LEVELS[globalIndex] ?? null;
}

export function getChapterForLevel(globalIndex) {
  let offset = 0;
  for (const ch of CHAPTERS) {
    if (globalIndex < offset + ch.levels.length) {
      return { chapter: ch, localIndex: globalIndex - offset };
    }
    offset += ch.levels.length;
  }
  return null;
}

export function globalIndexOf(chapter, levelInChapter) {
  let offset = 0;
  for (const ch of CHAPTERS) {
    if (ch.num === chapter) return offset + (levelInChapter - 1);
    offset += ch.levels.length;
  }
  return -1;
}

export function isChapterLocked(chapterNum, progress) {
  if (!isChapterProgressionUnlocked(chapterNum, progress, CHAPTERS)) return true;
  if (PREMIUM_CHAPTERS.includes(chapterNum) && !progress.isPremium) return true;
  return false;
}

export function getLockReason(chapterNum, progress) {
  if (!isChapterProgressionUnlocked(chapterNum, progress, CHAPTERS)) {
    return `Complete Chapter ${chapterNum - 1} first`;
  }
  if (PREMIUM_CHAPTERS.includes(chapterNum) && !progress.isPremium) {
    return 'Premium content — unlock to play';
  }
  return '';
}

export function totalLevels() {
  return ALL_LEVELS.length;
}
