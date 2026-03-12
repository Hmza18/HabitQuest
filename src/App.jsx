import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useHabitStore } from './hooks/useHabitStore';
import { useTheme } from './hooks/useTheme';
import HUD from './components/HUD';
import HabitCard from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import LevelUpOverlay from './components/LevelUpOverlay';
import ToastContainer from './components/ToastContainer';
import LandingPage from './components/LandingPage';
import QuickStartTemplates from './components/QuickStartTemplates';

function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#6366f1', '#22c55e', '#f59e0b', '#818cf8', '#4ade80'],
    startVelocity: 28,
    gravity: 0.9,
    scalar: 0.85,
  });
}

export default function App() {
  const [view, setView] = useState('landing');
  const { theme, toggleTheme } = useTheme();

  const {
    state,
    toasts,
    levelUp,
    addHabit,
    deleteHabit,
    toggleHabit,
    dismissToast,
    dismissLevelUp,
  } = useHabitStore();

  const handleToggle = useCallback((id) => {
    toggleHabit(id, triggerConfetti);
  }, [toggleHabit]);

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('app')} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <>
      {levelUp && (
        <LevelUpOverlay levelName={levelUp} onDismiss={dismissLevelUp} />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Back to landing nav */}
      <div className="app-topbar">
        <button className="app-topbar-back" onClick={() => setView('landing')}>
          ← HabitQuest
        </button>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="app-wrapper">
        <HUD player={state.player} habits={state.habits} />

        <main className="habits-section">
          {state.habits.length === 0 ? (
            <QuickStartTemplates onAdd={addHabit} />
          ) : (
            <div className="habits-grid">
              {state.habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggle}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddHabitForm onAdd={addHabit} />
    </>
  );
}
