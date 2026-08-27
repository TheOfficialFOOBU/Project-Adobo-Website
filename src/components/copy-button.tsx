'use client';

import { Check, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CopyButtonProps {
  /** Text placed on the clipboard (and shared via the share sheet). */
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
}

/**
 * Clipboard/share chip with a transient "copied" confirmation. Uses the
 * native share sheet where available (mobile), clipboard fallback elsewhere.
 */
export function CopyButton({ value, label, copiedLabel = 'Copied', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const onClick = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url: value });
        return;
      } catch {
        // User dismissed the sheet — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError(false);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <button
      type="button"
      className={className ?? 'copy-profile-link'}
      onClick={onClick}
      aria-live="polite"
    >
      {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      {copied ? copiedLabel : error ? 'Failed' : label}
    </button>
  );
}
