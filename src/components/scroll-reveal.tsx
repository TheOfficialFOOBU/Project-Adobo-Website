'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll-reveal coordinator for [data-animate] elements.
 * Supports animation variety via data-animate attribute values:
 *   - (empty/default) -> fade-up
 *   - "slide-left" -> slide from left
 *   - "slide-right" -> slide from right
 *   - "scale-in" -> scale up from 0.92
 *
 * Re-runs on every route change: client-side navigation swaps in a fresh DOM
 * whose [data-animate] elements have never been observed -- without the
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animated.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
