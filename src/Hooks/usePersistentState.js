// src/Hooks/usePersistentState.js
import { useState, useEffect } from 'react';

export function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Handle errors if needed (quota exceeded etc)
    }
  }, [key, state]);

  return [state, setState];
}
