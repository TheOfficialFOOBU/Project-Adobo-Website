'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CopyDiscordIdProps {
  /** Raw Discord user ID (snowflake). */
  discordId: string;
}

/**
 * Clipboard chip for a member's Discord ID. Shown alongside the
 * "View Discord Profile" link inside the profile dossier.
 *
 * - Keyboard + screen-reader accessible (button element, aria-live).
 * - Quiet "Copied" confirmation that auto-resets after ~1.6s.
 * - Falls back gracefully if the Clipboard API is unavailable.
 */
export function CopyDiscordId({ discordId }: CopyDiscordIdProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(discordId);
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
      setCopied(false);
    }
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      setError(false);
    }, 1600);
  };

  const label = copied ? 'Copied' : error ? 'Copy failed' : 'Copy Discord ID';

  return (
    <button
      type="button"
      className="copy-profile-link discord-action discord-action--copy"
      onClick={handleClick}
      aria-live="polite"
      aria-label={`Copy Discord ID for this member (${discordId})`}
      data-state={copied ? 'copied' : error ? 'error' : 'idle'}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}
