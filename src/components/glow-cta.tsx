'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';

interface GlowCtaProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Anchor that feeds pointer coordinates into CSS custom properties so the
 * .cta-button.glow::before radial light can follow the cursor (rAF-throttled).
 */
export function GlowCta({ href, className, children }: GlowCtaProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const frame = useRef(0);

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
  };

  return (
    <a
      ref={ref}
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onPointerMove}
    >
      {children}
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}
