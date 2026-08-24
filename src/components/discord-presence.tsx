'use client';

import { useEffect, useState } from 'react';

import { CopyButton } from '@/components/copy-button';
import { DISCORD_INVITE } from '@/lib/site';

type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

interface LanyardActivity {
  name?: string;
  state?: string;
  details?: string;
  type?: number;
}

interface LanyardData {
  discord_status?: DiscordStatus;
  activities?: LanyardActivity[];
  discord_user?: { username?: string };
}

const STATUS_LABEL: Record<DiscordStatus, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do not disturb',
  offline: 'Offline',
};

const REFRESH_MS = 60 * 1000;

/**
 * Discord block for member profiles. The deep-link button renders whenever a
 * `discordId` exists; the live presence line appears only when the member is
 * also enrolled with Lanyard (discord.gg/lanyard) and its API answers.
 * Everything degrades silently — no ID, nothing rendered at all.
 */
export function DiscordPresence({ discordId }: { discordId: string }) {
  const [status, setStatus] = useState<DiscordStatus | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (!response.ok) return;
        const payload = (await response.json()) as { success?: boolean; data?: LanyardData };
        if (cancelled || !payload.success || !payload.data) return;
        setStatus(payload.data.discord_status ?? null);
        const meaningful = payload.data.activities?.find((a) => a.type !== 4);
        const custom = payload.data.activities?.find((a) => a.type === 4);
        setActivity(meaningful?.name ?? custom?.state ?? null);
      } catch {
        // Offline / blocked — leave whatever we last had.
      }
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [discordId]);

  return (
    <div className="discord-presence">
      {status ? (
        <p className={`discord-presence-line status-${status}`}>
          <span className="discord-live-dot" aria-hidden="true" />
          <span aria-live="polite">
            {STATUS_LABEL[status]}
            {activity ? ` — ${activity}` : ''}
          </span>
        </p>
      ) : null}
      <div className="discord-presence-actions">
        <CopyButton value={DISCORD_INVITE} label="Copy invite" />
        <a
          href={`https://discord.com/users/${discordId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="copy-profile-link"
        >
          Open Discord profile
        </a>
      </div>
    </div>
  );
}
