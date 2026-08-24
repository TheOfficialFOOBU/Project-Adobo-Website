'use client';

import { useEffect, useState } from 'react';

import { DISCORD_WIDGET_JSON_URL, type DiscordPresence } from '@/lib/discord';

const REFRESH_MS = 5 * 60 * 1000;

/**
 * Live "N online" pill for the hero — seeded with the build-time snapshot
 * and refreshed client-side so long-open tabs stay current. Silent no-op
 * on refetch failures (keeps showing the last good numbers).
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
      {presence.avatars.length > 0 ? (
        <span className="discord-live-avatars" aria-hidden="true">
          {presence.avatars.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element -- remote Discord CDN avatars
            <img key={url} src={url} alt="" width={22} height={22} loading="lazy" />
          ))}
        </span>
      ) : null}
    </p>
  );
}
