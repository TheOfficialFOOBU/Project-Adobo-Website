'use client';

import { useEffect } from 'react';

/**
 * Subtle hero parallax — slides the .hero-bg layer down as the page scrolls,
 * purely via compositor-friendly transforms. Disabled for users who prefer
 * reduced motion, and a no-op when the layer is missing.
 */
export function HeroScrollFx() {
  useEffect(() => {
    const layer = document.querySelector<HTMLElement>('.hero-bg');
    if (!layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const shift = Math.min(window.scrollY * 0.22, 140);
      layer.style.transform = `translate3d(0, ${shift}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      layer.style.transform = '';
    };
  }, []);

  return null;
}
