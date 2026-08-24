'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import { DISCORD_INVITE } from '@/lib/site';
import type { RecruitmentConfig } from '@/lib/recruitment';

const DISMISS_KEY = 'recruit-banner-dismissed';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return true;
  }
}

/** SSR/hydration snapshot — banner stays hidden until the client confirms. */
function getServerSnapshot(): boolean {
  return true;
}

/**
 * Slim recruitment strip under the fixed site header. Dismissal persists in
 * localStorage; officers toggle openings via src/data/recruitment.json.
 */
export function RecruitmentBanner({ config }: { config: RecruitmentConfig }) {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();

  // Homepage-only chrome: profiles have their own fixed member bar at the
  // same slot, and error pages shouldn't carry recruitment noise.
  if (pathname !== '/' || !config.open || dismissed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Private mode — banner returns next visit, acceptable.
    }
    // storage only fires cross-tab; nudge this tab's subscription.
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="recruit-banner" role="status">
      <span className="discord-live-dot" aria-hidden="true" />
      <p>
        <strong>Now recruiting</strong>
        {config.seeking.length > 0 ? (
          <span className="recruit-seeking">
            {config.seeking.map((role) => (
              <span className="chip" key={role}>
                {role}
              </span>
            ))}
          </span>
        ) : null}
        <span className="recruit-note">{config.note}</span>
      </p>
      <a
        href={DISCORD_INVITE}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button small"
      >
        Join up
      </a>
      <button type="button" className="recruit-dismiss" aria-label="Dismiss" onClick={dismiss}>
        &times;
      </button>
    </div>
  );
}
