import { getLevelInfo, todayStr } from '../utils/gameLogic';
import { BADGE_DEFS } from '../utils/constants';

export default function HUD({ player, habits }) {
  const info = getLevelInfo(player.xp);
  const today = todayStr();
  const total = habits.length;
  const done = habits.filter(h => h.completedDates.includes(today)).length;
  const dayPct = total ? Math.round((done / total) * 100) : 0;

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const progressLabel = total === 0
    ? 'Add habits to get started'
    : done === total
    ? `🎉 All ${total} habits done today!`
    : `${done} of ${total} habits done today`;

  return (
    <header className="hud">
      <div className="hud-top">
        <div className="hud-title">
          <span className="hud-sword">⚔️</span>
          <span className="hud-name">HabitQuest</span>
        </div>
        <div className="hud-date">{dateLabel}</div>
      </div>

      <div className="hud-player">
        <div className="hud-level-badge">
          <span className="level-num">{info.idx + 1}</span>
          <span className="level-label">LVL</span>
        </div>
        <div className="hud-xp-block">
          <div className="hud-level-name">{info.name}</div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${info.pct}%` }} />
            <span className="xp-bar-text">
              {player.xp} XP · {info.next ? `${info.next.threshold - player.xp} to next` : 'MAX'}
            </span>
          </div>
        </div>
      </div>

      <div className="hud-badges">
        {player.badges.length === 0 ? (
          <span className="badges-empty">No badges yet — keep going!</span>
        ) : (
          player.badges.map(id => {
            const def = BADGE_DEFS.find(b => b.id === id);
            if (!def) return null;
            return (
              <span key={id} className="badge-chip unlocked" title={def.desc}>
                {def.emoji} {def.label}
              </span>
            );
          })
        )}
      </div>

      <div className="hud-progress-line">
        <span className="hud-progress-text">{progressLabel}</span>
        <div className="day-progress-track">
          <div className="day-progress-fill" style={{ width: `${dayPct}%` }} />
        </div>
      </div>
    </header>
  );
}
