'use client';

import { useEffect, useState } from 'react';

import { DISCORD_WIDGET_JSON_URL, type DiscordPresence } from '@/lib/discord';

const REFRESH_MS = 5 * 60 * 1000;

/**
 * Live "N online" pill for the hero — seeded with the build-time snapshot
 * and refreshed client-side so long-open tabs stay current. Silent no-op
 * on refetch failures (keeps showing the last good numbers).
 *
 * Deliberately text-only: the widget payload's avatar URLs point at
 * cdn.discordapp.com, whose responses carry a third-party `__cf_bm`
 * cookie that drags the Lighthouse best-practices score down.
 */
export function DiscordPresenceBadge({ initial }: { initial: DiscordPresence }) {
  const [presence, setPresence] = useState(initial);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const response = await fetch(DISCORD_WIDGET_JSON_URL, {
          headers: { accept: 'application/json' },
        });
        if (!response.ok) return;
        const data = (await response.json()) as { presence_count?: number };
        if (typeof data.presence_count === 'number') {
          setPresence((prev) => ({ ...prev, online: data.presence_count as number }));
        }
      } catch {
        // Offline / blocked / rate-limited — keep the last snapshot.
      }
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="discord-live-badge">
      <span className="discord-live-dot" aria-hidden="true" />
      <span aria-live="polite">
        {presence.online} wanderer{presence.online === 1 ? '' : 's'} online now
      </span>
    </p>
  );
}
