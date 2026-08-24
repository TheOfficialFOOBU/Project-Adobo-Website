'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll-reveal coordinator for [data-animate] elements.
 * Consolidates the original's two overlapping IntersectionObservers into one,
 * with the visible parameters of the primary system (threshold 0.18).
 *
 * Re-runs on every route change: client-side navigation swaps in a fresh DOM
 * whose [data-animate] elements have never been observed â€” without the
 * pathname dependency they would stay at opacity: 0 until a full reload.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const animated = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));

    if (!('IntersectionObserver' in window)) {
      animated.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    animated.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
