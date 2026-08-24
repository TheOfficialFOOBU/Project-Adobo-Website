import type { Metadata, Viewport } from 'next';

import { BackToTop } from '@/components/back-to-top';
import { MusicToggle } from '@/components/music-toggle';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SmoothAnchors } from '@/components/smooth-anchors';
import { asset, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: 'FOOBU' }],
  manifest: asset('/manifest.json'),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* The hero art is the LCP element — start fetching it before CSS parses. */}
        <link
          rel="preload"
          as="image"
          href={asset('/images/hero-bg-768.webp')}
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href={asset('/images/hero-bg-1280.webp')}
          media="(min-width: 768px) and (max-width: 1535px)"
        />
        <link
          rel="preload"
          as="image"
          href={asset('/images/hero-bg-1920.webp')}
          media="(min-width: 1536px)"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MusicToggle />
        <BackToTop />
        <ScrollReveal />
        <SmoothAnchors />
      </body>
    </html>
  );
}
