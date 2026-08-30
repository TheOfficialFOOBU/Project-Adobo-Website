'use client';

import { useEffect, useState } from 'react';

type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

const STATUS_LABEL: Record<DiscordStatus, string> = {
  online: 'Online on Discord',
  idle: 'Idle on Discord',
  dnd: 'Do Not Disturb on Discord',
  offline: 'Offline on Discord',
};

const STATUS_COLOR: Record<DiscordStatus, string> = {
  online: 'var(--cinnabar)',
  idle: 'var(--gold)',
  dnd: 'var(--crimson)',
  offline: 'var(--muted)',
};

const STATUS_BACKGROUND: Record<DiscordStatus, string> = {
  online: '#238636',
  idle: '#eab308',
  dnd: '#dc2626',
  offline: '#6b7280',
};

const REFRESH_MS = 60_000;

export function MemberDiscordStatus({ discordId }: { discordId: string }) {
  const [status, setStatus] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    const liveUrl = process.env.NEXT_PUBLIC_DISCORD_PRESENCE_URL;

    const fetchStatus = async () => {
      if (!liveUrl) return;
      try {
        const res = await fetch(`${liveUrl.replace(/\/$/, '')}/presence`, {
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          online: number;
          memberCount: number | null;
          avatars: string[];
          members: { id: string; status: DiscordStatus; avatar: string }[];
          asOf: string;
          source: string;
        };
        const member = data.members?.find((m) => m.id === discordId);
        if (!cancelled && member) {
          setStatus(member.status);
        }
      } catch {
        // offline / unreachable — keep last known state
      }
    };

    fetchStatus();
    const timer = setInterval(fetchStatus, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [discordId]);

  if (!status) return null;

  const label = STATUS_LABEL[status as DiscordStatus];
  const color = STATUS_COLOR[status as DiscordStatus];
  const background = STATUS_BACKGROUND[status as DiscordStatus];

  return (
    <span
      className="member-discord-status"
      aria-label={label}
      style={{
        color,
        backgroundColor: background,
      }}
    >
      <span className="member-discord-dot" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
