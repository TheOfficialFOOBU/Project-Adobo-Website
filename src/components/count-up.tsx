'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface CountUpProps {
  value: number;
  /** Animation length in ms once the element scrolls into view. */
  duration?: number;
  /** Optional extra class for the rendered value span. */
  className?: string;
}

/**
 * Counts from 0 to `value` when scrolled into view. Skips straight to the
 * final number under prefers-reduced-motion. The final value stays in the
 * DOM after settling, so screen readers announce it normally.
 */
export function CountUp({ value, duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const start = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplay(value);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        // Ease-out cubic — fast start, gentle landing.
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * value));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer.disconnect();
        start();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cn('guild-stat-value', className)}>
      {display}
    </span>
  );
}
