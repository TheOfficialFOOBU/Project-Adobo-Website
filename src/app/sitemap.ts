import type { MetadataRoute } from 'next';

import { GUILD_MEMBERS, memberSlug } from '@/lib/members';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const LAST_MODIFIED = new Date('2025-01-01');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
    },
    ...GUILD_MEMBERS.map((member) => ({
      url: `${SITE_URL}/members/${memberSlug(member)}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
    })),
  ];
}
