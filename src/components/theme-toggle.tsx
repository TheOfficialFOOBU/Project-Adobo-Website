'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Light/dark theme toggle. The initial theme is applied pre-hydration by an
 * inline script in layout.tsx (localStorage → prefers-color-scheme → dark);
 * this control just flips <html data-theme> and persists the choice.
 * The current value is read via useSyncExternalStore off a MutationObserver,
 * so no duplicated React state can drift from the DOM attribute.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Matches the inline script's dark default so hydration never mismatches. */
function getServerSnapshot(): Theme {
  return 'dark';
}

export function ThemeToggle({ className = 'theme-toggle' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === 'light';

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled — theme still applies for the session.
    }
  }, []);

  return (
    <button
      type="button"
      className={className}
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={isLight}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {isLight ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </button>
  );
}
