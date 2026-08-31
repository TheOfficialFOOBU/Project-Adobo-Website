'use client';

import { useEffect, useState } from 'react';

type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface MemberDiscordStatusData {
  status: DiscordStatus | null;
}

interface MemberDiscordStatusProps {
  discordId: string;
  /**
   * Visual treatment of the indicator. `dot` is the small ring/dot used
   * beside a member's name on roster cards; `line` is the editorial
   * status sentence used inside the profile dossier.
   */
  variant?: 'dot' | 'line';
  /** Poll cadence in milliseconds. Defaults to 60s — keeps load light. */
  refreshMs?: number;
}

const STATUS_LABEL: Record<DiscordStatus, string> = {
  online: 'Online on Discord',
  idle: 'Idle on Discord',
  dnd: 'Do Not Disturb on Discord',
  offline: 'Offline on Discord',
};

const STATUS_COPY: Record<DiscordStatus, string> = {
  online: 'Online on Discord',
  idle: 'Idle on Discord',
  dnd: 'Do Not Disturb',
  offline: 'Offline on Discord',
};

const DEFAULT_REFRESH_MS = 60_000;

/**
 * Live Discord presence for a single member. Polls the configured
 * `/presence` endpoint and matches the member by their `discordId`.
 *
 * - `variant="dot"`   → small status dot beside a member's name (cards).
 * - `variant="line"`  → editorial status sentence used inside profile dossiers.
 *
 * Renders nothing until the first successful poll lands. If a member has no
 * `discordId` the parent must not render this component at all.
 */
export function MemberDiscordStatus({
  discordId,
  variant = 'dot',
  refreshMs = DEFAULT_REFRESH_MS,
}: MemberDiscordStatusProps) {
  const [status, setStatus] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    const liveUrl = process.env.NEXT_PUBLIC_DISCORD_PRESENCE_URL;
    if (!liveUrl) return;

    const fetchStatus = async () => {
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
    const timer = setInterval(fetchStatus, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [discordId, refreshMs]);

  if (!status) return null;

  const label = STATUS_LABEL[status];
  const copy = STATUS_COPY[status];

  if (variant === 'line') {
    return (
      <p
        className={`discord-presence-line member-discord-line status-${status}`}
        data-status={status}
        aria-label={label}
      >
        <span className="discord-live-dot member-discord-dot" aria-hidden="true" />
        <span className="member-discord-text">{copy}</span>
        <span className="sr-only">{label}</span>
      </p>
    );
  }

  return (
    <span
      className={`member-discord-dot-badge member-discord-status status-${status}`}
      data-status={status}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="member-discord-dot" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
