'use client';

import { useEffect } from 'react';

/**
 * Smooth-scrolls in-page anchor links, mirroring the original delegated
 * handler (a[href^="#"] -> preventDefault -> scrollIntoView smooth).
 * Links whose targets do not exist are left untouched.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']");

      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
