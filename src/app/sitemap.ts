import type { MetadataRoute } from 'next';

import { GUILD_MEMBERS, memberSlug } from '@/lib/members';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const LAST_MODIFIED = new Date('2026-08-28');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
    },
    {
      url: `${SITE_URL}/rules`,
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
