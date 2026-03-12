import { LEVELS, BASE_XP, BADGE_DEFS } from './constants';

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBefore(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function calcStreak(completedDates) {
  if (!completedDates.length) return 0;
  const today = todayStr();
  const yesterday = daysBefore(today, 1);
  const set = new Set(completedDates);
  if (!set.has(today) && !set.has(yesterday)) return 0;
  let cursor = set.has(today) ? today : yesterday;
  let count = 0;
  while (set.has(cursor)) {
    count++;
    cursor = daysBefore(cursor, 1);
  }
  return count;
}

export function streakMultiplier(streak) {
  if (streak >= 30) return 2;
  if (streak >= 7)  return 1.5;
  return 1;
}

export function xpForHabit(habit) {
  const streak = calcStreak(habit.completedDates);
  return Math.round(BASE_XP * streakMultiplier(streak));
}

export function getLevelIndex(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].threshold) idx = i;
  }
  return idx;
}

export function getLevelInfo(xp) {
  const idx = getLevelIndex(xp);
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const xpInLevel = xp - current.threshold;
  const xpNeeded = next ? next.threshold - current.threshold : 1;
  const pct = next ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;
  return { idx, name: current.name, xpInLevel, xpNeeded, pct, next };
}

export function checkAndAwardBadges(state) {
  const earned = new Set(state.player.badges);
  const newBadges = [];
  const award = (id) => { if (!earned.has(id)) { earned.add(id); newBadges.push(id); } };

  if (state.habits.length >= 1) award('first_habit');

  for (const h of state.habits) {
    const s = calcStreak(h.completedDates);
    if (s >= 7)  award('on_fire');
    if (s >= 30) { award('grinder'); award('diamond'); }
  }

  if (state.habits.length > 0) {
    const today = todayStr();
    let allThreeDays = true;
    for (let d = 0; d < 3; d++) {
      const day = daysBefore(today, d);
      const anyMissed = state.habits.some(h => h.createdAt <= day && !h.completedDates.includes(day));
      if (anyMissed) { allThreeDays = false; break; }
    }
    if (allThreeDays) award('consistent');
  }

  return { newBadges, updatedBadges: [...earned] };
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}
