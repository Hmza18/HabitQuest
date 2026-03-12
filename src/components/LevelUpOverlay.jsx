import { useEffect } from 'react';

export default function LevelUpOverlay({ levelName, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="levelup-overlay" onClick={onDismiss}>
      <div className="levelup-content">
        <div className="levelup-icon">⚔️</div>
        <div className="levelup-label">LEVEL UP!</div>
        <div className="levelup-name">{levelName}</div>
        <div className="levelup-sub">Keep forging your habits</div>
      </div>
    </div>
  );
}
