import { useEffect } from 'react';
import { todayStr, calcStreak, getLevelInfo } from '../utils/gameLogic';

/**
 * Quest Log side panel — displays today's quests (habits), next milestone, and narrative blurb.
 * Uses existing useHabitStore / player data; no new source of truth.
 *
 * Props:
 * - isOpen: boolean — panel visibility
 * - onClose: () => void — close handler
 * - habits: array — from state.habits
 * - player: object — from state.player (xp, badges, etc.)
 */
export default function QuestLog({ isOpen, onClose, habits, player }) {
  const today = todayStr();
  const done = habits.filter(h => h.completedDates.includes(today)).length;
  const total = habits.length;
  const info = getLevelInfo(player?.xp ?? 0);

  // Narrative blurb based on progress
  const getNarrativeBlurb = () => {
    if (total === 0) return 'No quests yet — add habits to begin your journey.';
    if (done === 0) return 'The guild waits for your first move…';
    if (done < total) return "You're mid-quest, keep pressing forward.";
    return "All today's quests are complete. The campfire is warm.";
  };

  // Next milestone: level or badge
  const getNextMilestone = () => {
    const milestones = [];

    if (info.next && player) {
      const xpToNext = info.next.threshold - (player.xp ?? 0);
      milestones.push({
        type: 'level',
        text: `Reach level ${info.idx + 2} — ${info.next.name}`,
        sub: `${xpToNext} XP to go`,
      });
    }

    const earned = new Set(player?.badges ?? []);
    const maxStreak = Math.max(0, ...habits.map(h => calcStreak(h.completedDates)));
    const perfectDays = player?.perfectDays ?? 0;

    if (!earned.has('on_fire') && maxStreak < 7) {
      const daysTo7 = 7 - maxStreak;
      milestones.push({
        type: 'badge',
        text: `Unlock On Fire 🔥`,
        sub: `${daysTo7} day streak on any habit`,
      });
    }
    if (!earned.has('grinder') && maxStreak < 30) {
      const daysTo30 = 30 - maxStreak;
      milestones.push({
        type: 'badge',
        text: `Unlock Grinder 💪`,
        sub: `${daysTo30} day streak on any habit`,
      });
    }
    if (!earned.has('perfectionist') && perfectDays < 7) {
      const daysToPerfect = 7 - perfectDays;
      milestones.push({
        type: 'badge',
        text: `Unlock Perfectionist 🏆`,
        sub: `${daysToPerfect} perfect day${daysToPerfect !== 1 ? 's' : ''} to go`,
      });
    }

    return milestones[0] ?? null;
  };

  const nextMilestone = getNextMilestone();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="quest-log-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="quest-log-panel"
        role="dialog"
        aria-label="Quest Log"
      >
        <div className="quest-log-inner">
          <header className="quest-log-header">
            <h2 className="quest-log-title">
              <span className="quest-log-icon">📜</span>
              Quest Log
            </h2>
            <button
              className="quest-log-close"
              onClick={onClose}
              aria-label="Close Quest Log"
            >
              ✕
            </button>
          </header>

          <p className="quest-log-blurb">{getNarrativeBlurb()}</p>

          <section className="quest-log-section">
            <h3 className="quest-log-section-title">Today&apos;s Quests</h3>
            {habits.length === 0 ? (
              <p className="quest-log-empty">No habits yet — add some to see your quests here.</p>
            ) : (
              <ul className="quest-log-list">
                {habits.map((habit, i) => {
                  const isDone = habit.completedDates.includes(today);
                  const streak = calcStreak(habit.completedDates);
                  return (
                    <li
                      key={habit.id}
                      className={`quest-log-item ${isDone ? 'done' : ''}`}
                      style={{ animationDelay: `${50 + i * 40}ms` }}
                    >
                      <span className="quest-log-check">{isDone ? '✓' : ''}</span>
                      <span className="quest-log-emoji">{habit.emoji}</span>
                      <span className="quest-log-name">{habit.name}</span>
                      {streak > 0 && (
                        <span className="quest-log-streak">🔥 {streak}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {nextMilestone && (
            <section className="quest-log-section">
              <h3 className="quest-log-section-title">Next Milestone</h3>
              <div className="quest-log-milestone">
                <span className="quest-log-milestone-text">{nextMilestone.text}</span>
                <span className="quest-log-milestone-sub">{nextMilestone.sub}</span>
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
