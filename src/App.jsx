import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useHabitStore } from './hooks/useHabitStore';
import { useProfile } from './hooks/useProfile';
import { useTheme } from './hooks/useTheme';
import HUD from './components/HUD';
import HabitCard from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import LevelUpOverlay from './components/LevelUpOverlay';
import OnboardingWizard from './components/OnboardingWizard';
import ToastContainer from './components/ToastContainer';
import LandingPage from './components/LandingPage';
import QuickStartTemplates from './components/QuickStartTemplates';
import QuestLog from './components/QuestLog';

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
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { profile, saveProfile } = useProfile();

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

  const handleEnterFromLanding = useCallback(() => {
    if (profile) {
      setView('app');
    } else {
      setView('onboarding');
    }
  }, [profile]);

  const handleOnboardingComplete = useCallback((nextProfile) => {
    saveProfile(nextProfile);
    setView('app');
  }, [saveProfile]);

  const handleOnboardingSkip = useCallback(() => {
    setView('app');
  }, []);

  if (view === 'landing') {
    return (
      <LandingPage
        onEnter={handleEnterFromLanding}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (view === 'onboarding') {
    return (
      <>
        <LandingPage
          onEnter={handleEnterFromLanding}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </>
    );
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
        <div className="app-topbar-actions">
          <button
            className="quest-log-btn"
            onClick={() => setIsQuestLogOpen(true)}
            aria-label="Open Quest Log"
            title="Quest Log"
          >
            <span className="quest-log-btn-icon">📜</span>
            <span className="quest-log-btn-label">Quest Log</span>
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
      </div>

      <QuestLog
        isOpen={isQuestLogOpen}
        onClose={() => setIsQuestLogOpen(false)}
        habits={state.habits}
        player={state.player}
      />

      <div className="app-wrapper">
        <HUD player={state.player} habits={state.habits} profile={profile} />

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
