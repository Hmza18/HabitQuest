import { useEffect, useMemo, useState } from 'react';

const STEPS = 4;

const GUIDE_LINES = {
  1: 'Every hero needs a name. What should we call you?',
  2: 'Choose your main path for this chapter of your journey.',
  3: 'How much time can you realistically dedicate each day?',
  4: 'Do you want a chill adventure, a balanced quest, or a hardcore grind?',
};

export default function OnboardingWizard({ onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [focus, setFocus] = useState(null);
  const [timePerDay, setTimePerDay] = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [typedGuideText, setTypedGuideText] = useState(GUIDE_LINES[1]);
  const [isTyping, setIsTyping] = useState(false);
  const [ctaPulse, setCtaPulse] = useState(false);

  const canGoNext =
    (step === 1 && name.trim().length > 0) ||
    (step === 2 && !!focus) ||
    (step === 3 && !!timePerDay) ||
    (step === 4 && !!intensity);

  const guideText = useMemo(() => GUIDE_LINES[step], [step]);

  useEffect(() => {
    // Lightweight, non-blocking typewriter effect
    const full = guideText;
    setIsTyping(true);
    setTypedGuideText('');

    const maxDurationMs = 600;
    const perChar = full.length ? Math.min(30, Math.floor(maxDurationMs / full.length)) : 0;
    const start = Date.now();

    let frame;
    const tick = () => {
      const elapsed = Date.now() - start;
      const chars = perChar === 0 ? full.length : Math.min(full.length, Math.floor(elapsed / perChar));
      setTypedGuideText(full.slice(0, chars));
      if (chars >= full.length) {
        setIsTyping(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [guideText]);

  useEffect(() => {
    // Small one-time attention pulse when CTA becomes available
    if (!canGoNext) {
      setCtaPulse(false);
      return;
    }

    setCtaPulse(false);
    const timer = setTimeout(() => {
      setCtaPulse(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [canGoNext, step]);

  const handleNext = () => {
    if (step < STEPS) {
      setStep(step + 1);
      setCtaPulse(false);
    } else if (canGoNext) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setCtaPulse(false);
    }
  };

  const handleComplete = () => {
    const profile = {
      name: name.trim(),
      focus: focus || 'other',
      timePerDay: timePerDay || '5',
      intensity: intensity || 'balanced',
    };
    onComplete(profile);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card" role="dialog" aria-modal="true">
        <div className="onboarding-step-indicator">
          Step {step} of {STEPS}
        </div>

        <div className="onboarding-guide">
          <div className="onboarding-guide-avatar" aria-hidden="true">
            🧙
          </div>
          <div className="onboarding-guide-text-block">
            <div className="onboarding-guide-label">Quest Guide</div>
            <p className="onboarding-guide-text">
              {typedGuideText}
              {isTyping && <span className="onboarding-guide-caret" />}
            </p>
          </div>
        </div>

        <div
          key={step}
          className="onboarding-step-wrapper onboarding-step-animate"
        >
          {step === 1 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">What should we call you?</h2>
              <p className="onboarding-subtitle">
                Pick a name or nickname for your quest log.
              </p>
              <input
                className="onboarding-input"
                type="text"
                placeholder="Alex, Nova, Nightblade..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">
                What&apos;s your main focus right now?
              </h2>
              <p className="onboarding-subtitle">
                We&apos;ll keep this in mind as you build habits.
              </p>
              <div className="onboarding-chips">
                {[
                  { id: 'health', label: 'Health' },
                  { id: 'mind', label: 'Mind' },
                  { id: 'productivity', label: 'Productivity' },
                  { id: 'learning', label: 'Learning' },
                  { id: 'other', label: 'Other' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={
                      'onboarding-chip' +
                      (focus === option.id ? ' onboarding-chip--selected' : '')
                    }
                    onClick={() => setFocus(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">
                How much time can you dedicate each day?
              </h2>
              <p className="onboarding-subtitle">
                Be honest — even 5 minutes is enough to start.
              </p>
              <div className="onboarding-chips">
                {[
                  { id: '5', label: '5 min' },
                  { id: '15', label: '15 min' },
                  { id: '30+', label: '30+ min' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={
                      'onboarding-chip' +
                      (timePerDay === option.id
                        ? ' onboarding-chip--selected'
                        : '')
                    }
                    onClick={() => setTimePerDay(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">
                How intense do you want your quest to feel?
              </h2>
              <p className="onboarding-subtitle">
                We&apos;ll use this to keep your expectations realistic.
              </p>
              <div className="onboarding-chips">
                {[
                  { id: 'chill', label: 'Chill' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'hardcore', label: 'Hardcore' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={
                      'onboarding-chip' +
                      (intensity === option.id
                        ? ' onboarding-chip--selected'
                        : '')
                    }
                    onClick={() => setIntensity(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="onboarding-actions">
          <div className="onboarding-actions-left">
            {step > 1 && (
              <button
                type="button"
                className="onboarding-secondary"
                onClick={handleBack}
              >
                Back
              </button>
            )}
          </div>
          <div className="onboarding-actions-right">
            <button
              type="button"
              className={
                'onboarding-primary' +
                (ctaPulse && !isTyping && canGoNext
                  ? ' onboarding-primary--pulse'
                  : '')
              }
              onClick={handleNext}
              disabled={!canGoNext}
            >
              {step === STEPS ? 'Start Your Quest' : 'Next'}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="onboarding-skip"
          onClick={() => onSkip()}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

