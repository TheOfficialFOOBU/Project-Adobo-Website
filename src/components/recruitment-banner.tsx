'use client';

import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { BASE_PATH, DISCORD_INVITE } from '@/lib/site';
import type { RecruitmentConfig } from '@/lib/recruitment';

/**
 * Slim recruitment strip under the fixed site header. Dismissed state is
 * in-memory only — the banner reappears on every page load/refresh.
 * Officers toggle openings via src/data/recruitment.json.
 */
export function RecruitmentBanner({ config }: { config: RecruitmentConfig }) {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Homepage-only chrome: profiles have their own fixed member bar at the
  // same slot, and error pages shouldn't carry recruitment noise.
  const isHome = pathname === '/' || pathname === BASE_PATH || pathname === `${BASE_PATH}/`;
  if (!isHome || !config.open || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="recruit-banner" role="status">
      <span className="recruit-banner-chapter" aria-hidden="true">
        募
      </span>
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
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <button type="button" className="recruit-dismiss" aria-label="Dismiss" onClick={dismiss}>
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
