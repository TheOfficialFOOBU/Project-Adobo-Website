'use client';

import { CopyButton } from '@/components/copy-button';

interface CopyProfileLinkProps {
  /** Absolute share URL for this profile. */
  url: string;
}

/** Share button on member profiles — thin wrapper over the generic CopyButton. */
export function CopyProfileLink({ url }: CopyProfileLinkProps) {
  return <CopyButton value={url} label="Share profile" />;
}
