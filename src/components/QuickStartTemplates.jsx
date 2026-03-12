import { useState } from 'react';

const TEMPLATES = [
  { emoji: '💧', name: 'Drink 2L Water' },
  { emoji: '📚', name: 'Read 20 mins' },
  { emoji: '🏃', name: 'Morning Run' },
  { emoji: '🧘', name: 'Meditate' },
  { emoji: '😴', name: 'Sleep 8 Hours' },
  { emoji: '✍️', name: 'Journal' },
  { emoji: '🥗', name: 'Eat Healthy' },
  { emoji: '💪', name: 'Workout' },
];

export default function QuickStartTemplates({ onAdd }) {
  const [tappedId, setTappedId] = useState(null);

  const handleClick = (template) => {
    if (tappedId) return;
    setTappedId(template.name);
    setTimeout(() => {
      onAdd(template.name, template.emoji);
    }, 150);
  };

  return (
    <div className="empty-state">
      <div className="empty-icon">🌱</div>
      <p className="empty-title">No habits yet</p>
      <p className="empty-sub">Add your first habit below to start your quest</p>

      <div className="qs-section">
        <p className="qs-heading">Or start with a popular habit:</p>
        <div className="qs-chips">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              className={`qs-chip${tappedId === t.name ? ' qs-chip--tapped' : ''}`}
              onClick={() => handleClick(t)}
            >
              <span className="qs-chip-emoji">{t.emoji}</span>
              <span className="qs-chip-name">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
