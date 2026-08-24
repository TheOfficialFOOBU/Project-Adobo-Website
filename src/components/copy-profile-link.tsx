'use client';

import { Check, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CopyProfileLinkProps {
  /** Absolute share URL for this profile. */
  url: string;
}

/**
 * Share button: native share sheet where available (mobile), clipboard
 * fallback elsewhere, with a transient "Copied" confirmation.
 */
export function CopyProfileLink({ url }: CopyProfileLinkProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const onCopy = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // User dismissed the sheet — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — no-op.
    }
  };

  return (
    <button type="button" className="copy-profile-link" onClick={onCopy} aria-live="polite">
      {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      {copied ? 'Link copied' : 'Share profile'}
    </button>
  );
}
