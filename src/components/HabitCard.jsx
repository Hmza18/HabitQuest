import { useState } from 'react';
import { calcStreak, xpForHabit, todayStr, daysBefore } from '../utils/gameLogic';

export default function HabitCard({ habit, onToggle, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  const today = todayStr();
  const isChecked = habit.completedDates.includes(today);
  const streak = calcStreak(habit.completedDates);
  const xp = xpForHabit(habit);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dateStr = daysBefore(today, 6 - i);
    const date = new Date(dateStr + 'T12:00:00');
    return {
      dateStr,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      isToday: dateStr === today,
      done: habit.completedDates.includes(dateStr),
    };
  });

  const handleToggle = () => {
    if (!isChecked) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 500);
    }
    onToggle(habit.id);
  };

  const cardClass = [
    'habit-card',
    streak > 0 && !isChecked ? 'streak-active' : '',
    isChecked ? 'completed-today' : '',
    justChecked ? 'just-checked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      {/* ── TOP ROW ── */}
      <div className="habit-top-row">
        <button
          className={`habit-check${isChecked ? ' checked' : ''}`}
          onClick={handleToggle}
          aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
        >
          {isChecked && '✓'}
        </button>

        <span className="habit-emoji">{habit.emoji}</span>

        <div className="habit-info">
          <div className="habit-name">{habit.name}</div>
          <div className="habit-meta">
            <span className={`streak-badge${streak === 0 ? ' zero' : ''}`}>
              {streak === 0 ? '— no streak' : `🔥 ${streak} day${streak !== 1 ? 's' : ''}`}
            </span>
            <span className="xp-tag">+{xp} XP</span>
          </div>
        </div>

        {confirming ? (
          <div className="delete-confirm">
            <span>Delete?</span>
            <button className="delete-confirm-yes" onClick={() => onDelete(habit.id)}>Yes</button>
            <button className="delete-confirm-no" onClick={() => setConfirming(false)}>No</button>
          </div>
        ) : (
          <button
            className="habit-delete"
            aria-label="Delete habit"
            onClick={() => setConfirming(true)}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── MINI CALENDAR ── */}
      <div className="mini-cal">
        {weekDays.map((day) => (
          <div key={day.dateStr} className="mini-cal-day">
            <div
              className={[
                'mini-cal-dot',
                day.done    ? 'mini-cal-dot--done'  : '',
                day.isToday ? 'mini-cal-dot--today' : '',
              ].filter(Boolean).join(' ')}
              aria-label={`${day.dateStr}${day.done ? ' — completed' : ''}`}
            >
              {day.done && <span className="mini-cal-check">✓</span>}
            </div>
            <span className="mini-cal-label">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
