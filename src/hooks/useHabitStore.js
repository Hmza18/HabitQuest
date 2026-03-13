import { useState, useCallback, useRef } from 'react';
import { STORAGE_KEY, DEFAULT_STATE, BADGE_DEFS, LEVELS } from '../utils/constants';
import {
  todayStr, calcStreak, xpForHabit, getLevelIndex,
  checkAndAwardBadges, uid,
} from '../utils/gameLogic';

const UNDO_TOAST_MS = 5000;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        player: { ...DEFAULT_STATE.player, ...parsed.player },
        habits: parsed.habits || [],
      };
    }
  } catch (_) { /* corrupt — fall through */ }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useHabitStore() {
  const [state, setState] = useState(loadState);
  const [toasts, setToasts] = useState([]);
  const [levelUp, setLevelUp] = useState(null); // level name string or null
  const lastToggledRef = useRef(null); // { habitId, justChecked } for undo

  const addToast = useCallback((message, type = '', options = {}) => {
    const id = uid();
    const timeoutMs = options.timeoutMs ?? 3500;
    const toast = { id, message, type, ...options };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      if (options.onExpire) options.onExpire();
    }, timeoutMs);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearLastToggled = useCallback(() => {
    lastToggledRef.current = null;
  }, []);

  const undoLastToggle = useCallback(() => {
    const last = lastToggledRef.current;
    if (!last) return;
    lastToggledRef.current = null;

    setState(prev => {
      const today = todayStr();
      const habit = prev.habits.find(h => h.id === last.habitId);
      if (!habit) return prev;

      const hasToday = habit.completedDates.includes(today);
      // Undo: if we had just checked (justChecked true), we need to uncheck now (remove today).
      // If we had just unchecked (justChecked false), we need to check again (add today).
      const shouldHaveToday = !last.justChecked;
      if (hasToday === shouldHaveToday) return prev; // already in target state

      let updatedHabit;
      let xpDelta;
      if (shouldHaveToday) {
        updatedHabit = { ...habit, completedDates: [...habit.completedDates, today] };
        xpDelta = xpForHabit(updatedHabit);
      } else {
        updatedHabit = { ...habit, completedDates: habit.completedDates.filter(d => d !== today) };
        xpDelta = -xpForHabit(habit); // habit still has today
      }

      const newXp = Math.max(0, prev.player.xp + xpDelta);
      const updatedHabits = prev.habits.map(h => h.id === last.habitId ? updatedHabit : h);
      const next = {
        ...prev,
        player: { ...prev.player, xp: newXp },
        habits: updatedHabits,
      };
      persist(next);
      return next;
    });
  }, []);

  const addHabit = useCallback((name, emoji) => {
    setState(prev => {
      const newHabit = {
        id: uid(),
        name: name.trim(),
        emoji,
        createdAt: todayStr(),
        completedDates: [],
      };
      const next = { ...prev, habits: [...prev.habits, newHabit] };

      // First habit badge
      if (!prev.player.badges.includes('first_habit')) {
        next.player = { ...next.player, badges: [...next.player.badges, 'first_habit'] };
        setTimeout(() => addToast('🌱 Badge unlocked: First Habit', 'badge'), 100);
      }

      persist(next);
      return next;
    });
  }, [addToast]);

  const deleteHabit = useCallback((id) => {
    setState(prev => {
      const next = { ...prev, habits: prev.habits.filter(h => h.id !== id) };
      persist(next);
      return next;
    });
  }, []);

  const toggleHabit = useCallback((id, triggerConfetti) => {
    setState(prev => {
      const today = todayStr();
      const habit = prev.habits.find(h => h.id === id);
      if (!habit) return prev;

      const alreadyDone = habit.completedDates.includes(today);
      const prevLevelIdx = getLevelIndex(prev.player.xp);

      let updatedHabit;
      let xpDelta;

      if (alreadyDone) {
        updatedHabit = { ...habit, completedDates: habit.completedDates.filter(d => d !== today) };
        xpDelta = -xpForHabit(updatedHabit);
      } else {
        updatedHabit = { ...habit, completedDates: [...habit.completedDates, today] };
        xpDelta = xpForHabit(updatedHabit);
      }

      const newXp = Math.max(0, prev.player.xp + xpDelta);
      const updatedHabits = prev.habits.map(h => h.id === id ? updatedHabit : h);

      // Badge check
      const tempState = { player: { ...prev.player, xp: newXp }, habits: updatedHabits };
      const { newBadges, updatedBadges } = checkAndAwardBadges(tempState);

      // Perfect day tracking
      let perfectDays = prev.player.perfectDays || 0;
      let lastPerfectCheck = prev.player.lastPerfectCheck;
      if (!alreadyDone && prev.player.lastPerfectCheck !== today) {
        const allDone = updatedHabits.every(h => h.completedDates.includes(today));
        if (allDone) {
          perfectDays += 1;
          lastPerfectCheck = today;
          if (perfectDays >= 7 && !updatedBadges.includes('perfectionist')) {
            updatedBadges.push('perfectionist');
            newBadges.push('perfectionist');
          }
        }
      }

      const next = {
        player: { ...prev.player, xp: newXp, badges: updatedBadges, perfectDays, lastPerfectCheck },
        habits: updatedHabits,
      };

      persist(next);

      // Store for undo (last action only)
      lastToggledRef.current = { habitId: id, justChecked: !alreadyDone };

      // Side effects after state update
      if (!alreadyDone) {
        triggerConfetti && triggerConfetti();
        setTimeout(() => addToast(`+${xpForHabit(updatedHabit)} XP earned!`, 'xp'), 50);
        newBadges.forEach(bId => {
          const def = BADGE_DEFS.find(b => b.id === bId);
          if (def) setTimeout(() => addToast(`${def.emoji} Badge unlocked: ${def.label}`, 'badge'), 400);
        });
        const newLevelIdx = getLevelIndex(newXp);
        if (newLevelIdx > prevLevelIdx) {
          setTimeout(() => setLevelUp(LEVELS[newLevelIdx].name), 200);
        }
      }

      return next;
    });

    // Show undo toast after state is committed
    setTimeout(() => {
      addToast(
        alreadyDone ? 'Habit unchecked' : 'Marked complete',
        'undo',
        {
          actionLabel: 'Undo',
          onUndo: undoLastToggle,
          timeoutMs: UNDO_TOAST_MS,
          onExpire: clearLastToggled,
        }
      );
    }, 0);
  }, [addToast, undoLastToggle, clearLastToggled]);

  const dismissLevelUp = useCallback(() => setLevelUp(null), []);

  return { state, toasts, levelUp, addHabit, deleteHabit, toggleHabit, dismissToast, dismissLevelUp };
}
