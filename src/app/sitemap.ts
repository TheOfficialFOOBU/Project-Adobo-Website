import type { MetadataRoute } from 'next';

import { GUILD_MEMBERS, memberSlug } from '@/lib/members';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    ...GUILD_MEMBERS.map((member) => ({
      url: `${SITE_URL}/members/${memberSlug(member)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
    })),
  ];
}
