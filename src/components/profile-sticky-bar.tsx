'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface StickyNeighborLink {
  name: string;
  href: string;
}

interface ProfileStickyBarProps {
  name: string;
  position: string;
  thumb: string;
  prev?: StickyNeighborLink | null;
  next?: StickyNeighborLink | null;
  children: ReactNode;
}

/**
 * Slim context bar that slides in under the fixed site header once the
 * profile card's top has scrolled out of view — keeps the member's
 * identity and prev/next navigation reachable on long pages. The zero-
 * height sentinel sits just above the wrapped children.
 */
export function ProfileStickyBar({
  name,
  position,
  thumb,
  prev,
  next,
  children,
}: ProfileStickyBarProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      {children}
      <div
        className={cn('profile-sticky-bar', visible && 'is-visible')}
        aria-hidden={!visible}
        inert={!visible}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
        <img src={thumb} alt={name} width={34} height={34} loading="lazy" />
        <div className="profile-sticky-meta">
          <strong>{name}</strong>
          <span>{position}</span>
        </div>
        <nav className="profile-sticky-nav" aria-label="Member navigation">
          {prev ? (
            <Link href={prev.href}>
              <span aria-hidden="true">&larr;</span> {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.href}>
              {next.name} <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </>
  );
}
