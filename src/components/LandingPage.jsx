export default function LandingPage({ onEnter, theme, onToggleTheme }) {
  const features = [
    {
      icon: '🎯',
      title: 'Daily Habit Tracking',
      desc: 'Check off habits each day with a single tap. Simple, frictionless, and satisfying.',
    },
    {
      icon: '⚔️',
      title: 'Quest-Based System',
      desc: 'Every habit is a quest. Complete them daily to earn XP and progress through your journey.',
    },
    {
      icon: '🔥',
      title: 'Streak Engine',
      desc: 'Build unstoppable momentum. Longer streaks multiply your XP and push you toward mastery.',
    },
    {
      icon: '🏆',
      title: 'Badges & Achievements',
      desc: 'Unlock badges like On Fire, Grinder, and Diamond as you hit milestones that matter.',
    },
    {
      icon: '📈',
      title: 'XP & Leveling',
      desc: 'Rise from Novice to Legend. Every completed habit moves you closer to the next level.',
    },
    {
      icon: '💾',
      title: 'Saved Automatically',
      desc: 'Your progress is saved locally — no account needed. Open the app and pick up right where you left off.',
    },
  ];

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">⚔️ HabitQuest</span>
          <div className="landing-nav-right">
            <button
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="landing-nav-cta" onClick={onEnter}>
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-badge">✦ Gamified habit tracker</div>

          <h1 className="hero-title">
            Build habits that{' '}
            <span className="hero-gradient">level you up</span>
          </h1>

          <p className="hero-tagline">
            Turn your daily habits into quests and level up your life.
            <br className="hero-br" />
            Earn XP, unlock badges, and forge unbreakable streaks.
          </p>

          <div className="hero-actions">
            <button className="hero-cta" onClick={onEnter}>
              Start Your Quest
              <span className="hero-cta-arrow">→</span>
            </button>
          </div>

          <p className="hero-sub">
            Build powerful habits, track progress, and stay consistent every day.
          </p>

          {/* ── MOCK APP PREVIEW ── */}
          <div className="hero-preview">
            <div className="preview-hud">
              <div className="preview-level">
                <span className="preview-lvl-num">4</span>
                <span className="preview-lvl-label">LVL</span>
              </div>
              <div className="preview-xp-block">
                <span className="preview-rank">Master</span>
                <div className="preview-bar-track">
                  <div className="preview-bar-fill" style={{ width: '62%' }} />
                </div>
              </div>
              <span className="preview-xp-text">620 XP</span>
            </div>

            <div className="preview-habits">
              {[
                { emoji: '💧', name: 'Drink 2L Water',    streak: 12, done: true },
                { emoji: '📚', name: 'Read 20 mins',      streak: 7,  done: true },
                { emoji: '🏃', name: 'Morning run',       streak: 3,  done: false },
                { emoji: '🧘', name: 'Meditate',          streak: 0,  done: false },
              ].map((h, i) => (
                <div key={i} className={`preview-card${h.done ? ' preview-done' : ''}`}>
                  <div className={`preview-check${h.done ? ' preview-checked' : ''}`}>
                    {h.done && '✓'}
                  </div>
                  <span className="preview-emoji">{h.emoji}</span>
                  <div className="preview-info">
                    <span className="preview-name">{h.name}</span>
                    <span className="preview-streak">
                      {h.streak > 0 ? `🔥 ${h.streak} days` : '— no streak'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          {[
            { value: '6',    label: 'Levels to reach' },
            { value: '6',    label: 'Unique badges' },
            { value: '2×',   label: 'Max XP multiplier' },
            { value: '100%', label: 'Works offline' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="features-inner">
          <div className="section-eyebrow">Why HabitQuest?</div>
          <h2 className="section-title">Everything you need to stay consistent</h2>
          <p className="section-sub">
            No bloat, no subscriptions. Just a focused tool that makes building habits feel like progress.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how">
        <div className="how-inner">
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-title">From zero to Legend in three steps</h2>

          <div className="steps">
            {[
              { n: '01', title: 'Add your habits', desc: 'Pick an emoji, name your habit, and add it to your quest list in seconds.' },
              { n: '02', title: 'Check in daily',  desc: 'Mark habits complete each day. Your streak grows and your XP multiplier increases.' },
              { n: '03', title: 'Level up',        desc: 'Hit XP thresholds to level up, unlock achievement badges, and become Legend.' },
            ].map((s, i) => (
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bottom-cta">
        <div className="bottom-cta-inner">
          <div className="bottom-cta-glow" aria-hidden="true" />
          <h2 className="bottom-cta-title">Ready to start your quest?</h2>
          <p className="bottom-cta-sub">
            No sign-up. No subscription. Just open the app and begin.
          </p>
          <button className="hero-cta" onClick={onEnter}>
            Start Your Quest
            <span className="hero-cta-arrow">→</span>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span>⚔️ HabitQuest</span>
        <span className="footer-sep">·</span>
        <span>Built with React + Vite</span>
      </footer>

    </div>
  );
}
