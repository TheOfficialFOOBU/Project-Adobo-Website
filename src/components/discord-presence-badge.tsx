'use client';

import { useEffect, useState } from 'react';

import { DISCORD_WIDGET_JSON_URL, type DiscordPresence } from '@/lib/discord';

const REFRESH_MS = 60_000;

/**
 * Live "N online" pill for the hero — seeded with the build-time snapshot
 * and refreshed client-side so long-open tabs stay current. Silent no-op
 * on refetch failures (keeps showing the last good numbers).
 *
 * Priority order:
 *  1. `window.__DISCORD_PRESENCE_URL__` — public URL of the live bot
 *     (injected at build time from `NEXT_PUBLIC_DISCORD_PRESENCE_URL`).
 *  2. The public Discord widget endpoint as a final fallback.
 *
 * Deliberately text-only: the widget payload's avatar URLs point at
 * cdn.discordapp.com, whose responses carry a third-party `__cf_bm`
 * cookie that drags the Lighthouse best-practices score down.
 */
export function DiscordPresenceBadge({ initial }: { initial: DiscordPresence }) {
  const [presence, setPresence] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    const liveUrl = process.env.NEXT_PUBLIC_DISCORD_PRESENCE_URL;

    const refresh = async () => {
      if (liveUrl) {
        try {
          const res = await fetch(`${liveUrl.replace(/\/$/, '')}/presence`, {
            headers: { accept: 'application/json' },
            signal: AbortSignal.timeout(10000),
          });
          if (res.ok) {
            const data = (await res.json()) as Partial<DiscordPresence> & {
              online?: number;
            };
            if (!cancelled && typeof data.online === 'number') {
              setPresence((prev) => ({
                online: data.online as number,
                memberCount:
                  typeof data.memberCount === 'number' ? data.memberCount : prev.memberCount,
                avatars: Array.isArray(data.avatars) ? data.avatars.slice(0, 6) : prev.avatars,
              }));
              return;
            }
          }
        } catch {
          /* fall through to widget */
        }
      }

      try {
        const response = await fetch(DISCORD_WIDGET_JSON_URL, {
          headers: { accept: 'application/json' },
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          presence_count?: number;
          members?: { avatar_url?: string }[];
        };
        if (cancelled) return;
        if (typeof data.presence_count === 'number') {
          setPresence((prev) => ({
            ...prev,
            online: data.presence_count as number,
            avatars: Array.isArray(data.members)
              ? data.members
                  .map((m) => m.avatar_url)
                  .filter((u): u is string => typeof u === 'string')
                  .slice(0, 6)
              : prev.avatars,
          }));
        }
      } catch {
        // Offline / blocked / rate-limited — keep the last snapshot.
      }
    };

    const timer = setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
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
