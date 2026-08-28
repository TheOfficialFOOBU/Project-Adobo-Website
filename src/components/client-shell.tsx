'use client';

import dynamic from 'next/dynamic';

const BackToTop = dynamic(() => import('@/components/back-to-top').then((m) => m.BackToTop), {
  ssr: false,
});
const MusicToggle = dynamic(() => import('@/components/music-toggle').then((m) => m.MusicToggle), {
  ssr: false,
});
const SmoothAnchors = dynamic(
  () => import('@/components/smooth-anchors').then((m) => m.SmoothAnchors),
  { ssr: false }
);
const ScrollReveal = dynamic(
  () => import('@/components/scroll-reveal').then((m) => m.ScrollReveal),
  { ssr: false }
);

/**
 * Client-side only components that don't need SSR.
 * Grouped here so layout.tsx (a Server Component) can render them
 * without using `ssr: false` directly.
 */
export function ClientShell() {
  return (
    <>
      <ScrollReveal />
      <BackToTop />
      <MusicToggle />
      <SmoothAnchors />
    </>
  );
}
