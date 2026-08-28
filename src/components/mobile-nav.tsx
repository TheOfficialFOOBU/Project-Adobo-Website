'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { BASE_PATH, NAV_LINKS } from '@/lib/site';

function noop() {
  return () => {};
}
function getServerSnapshot() {
  return false;
}
function getClientSnapshot() {
  return true;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  isHome: boolean;
}

/**
 * Mobile-only nav rendered via Portal into document.body.
 * Zero extra DOM in the static HTML — only mounts after hydration.
 */
export function MobileNav({ open, onClose, isHome }: MobileNavProps) {
  const mounted = useSyncExternalStore(noop, getClientSnapshot, getServerSnapshot);

  const resolveHref = (href: string) => {
    if (!href.startsWith('#')) return href;
    return isHome ? href : `${BASE_PATH}/${href}`;
  };

  if (!mounted) return null;

  return createPortal(
    <nav
      id="mobile-nav"
      aria-label="Main navigation"
      className={open ? 'mobile-nav open' : 'mobile-nav'}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) onClose();
      }}
    >
      <ul>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={resolveHref(link.href)}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>,
    document.body
  );
}
