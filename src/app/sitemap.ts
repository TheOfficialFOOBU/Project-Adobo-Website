import type { MetadataRoute } from 'next';

import { GUILD_MEMBERS, memberSlug } from '@/lib/members';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/** Stable date — update manually when content changes to avoid unnecessary re-crawls. */
const LAST_MODIFIED = '2025-08-28';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/rules`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...GUILD_MEMBERS.map((member) => ({
      url: `${SITE_URL}/members/${memberSlug(member)}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
