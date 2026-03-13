import { useState, useCallback } from 'react';

const PROFILE_KEY = 'habitquest-profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (_) {
    // ignore and fall through to null
  }
  return null;
}

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile);

  const saveProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...(prev || {}), ...updates };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      } catch (_) {
        // ignore storage errors (e.g. private mode)
      }
      return next;
    });
  }, []);

  return { profile, saveProfile };
}


