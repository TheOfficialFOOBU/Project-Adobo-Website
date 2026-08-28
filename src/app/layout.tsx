import type { Metadata, Viewport } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClientShell } from '@/components/client-shell';
import { RecruitmentBanner } from '@/components/recruitment-banner';
import { RECRUITMENT } from '@/lib/recruitment';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { GUILD_MEMBERS } from '@/lib/members';
import { asset, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: 'FOOBU' }],
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-card.jpg',
        width: 1200,
        height: 630,
        alt: 'Adobo Guild — Where Winds Meet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/og-card.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#12100d' },
    { media: '(prefers-color-scheme: light)', color: '#f2ecdf' },
  ],
};

/**
 * Applies the saved (or system) theme to <html> before first paint so the
 * light theme never flashes dark. Kept in sync with components/theme-toggle.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

const GUILD_ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_TITLE,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-640.webp`,
  description: SITE_DESCRIPTION,
  sameAs: ['https://discord.gg/NdZXkmYJnS'],
  foundingDate: '2024',
  member: GUILD_MEMBERS.map((m) => ({
    '@type': 'OrganizationRole',
    member: {
      '@type': 'Person',
      name: m.name,
      url: `${SITE_URL}/members/${m.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    roleName: m.position,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GUILD_ORG_SCHEMA) }}
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={asset('/fonts/inter-400.woff2')}
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={asset('/fonts/cormorant-garamond-600.woff2')}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <RecruitmentBanner config={RECRUITMENT} />
        {children}
        <SiteFooter />
        <ClientShell />
        <Analytics />
        <SpeedInsights />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '[data-animate]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </body>
    </html>
  );
}
