export const STORAGE_KEY = 'habitquest';

export const LEVELS = [
  { threshold: 0,    name: 'Novice' },
  { threshold: 100,  name: 'Apprentice' },
  { threshold: 250,  name: 'Adept' },
  { threshold: 500,  name: 'Master' },
  { threshold: 1000, name: 'Champion' },
  { threshold: 2000, name: 'Legend' },
];

export const BADGE_DEFS = [
  { id: 'first_habit',    emoji: '🌱', label: 'First Habit',   desc: 'Added your first habit' },
  { id: 'on_fire',        emoji: '🔥', label: 'On Fire',       desc: '7-day streak on any habit' },
  { id: 'consistent',     emoji: '⚡', label: 'Consistent',    desc: 'All habits done 3 days in a row' },
  { id: 'perfectionist',  emoji: '🏆', label: 'Perfectionist', desc: '7 perfect days' },
  { id: 'grinder',        emoji: '💪', label: 'Grinder',       desc: '30-day streak on any habit' },
  { id: 'diamond',        emoji: '💎', label: 'Diamond',       desc: '30-day streak — legendary!' },
];

export const EMOJIS = [
  '💧','📚','🏃','🧘','🥗','😴','💊','🎯',
  '🎸','✍️','🧹','🌿','🐕','🚴','🏋️','🎨',
  '🧠','💻','📝','🎵','🌅','🍎','🫁','🛁',
  '☕','🧃','🪥','👟','🎤','🗓️','🌙','⭐',
];

export const BASE_XP = 10;

export const DEFAULT_STATE = {
  player: {
    xp: 0,
    badges: [],
    perfectDays: 0,
    lastPerfectCheck: null,
  },
  habits: [],
};
