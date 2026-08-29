'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
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
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const resolveHref = (href: string) => {
    if (!href.startsWith('#')) return href;
    return isHome ? href : `${BASE_PATH}/${href}`;
  };

  // When the panel opens, move focus to the close button so the user can
  // dismiss the menu with Enter / Space without hunting the corner of the
  // screen. On close, drop focus back to the trigger handled by the parent.
  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <nav
      id="mobile-nav"
      aria-label="Main navigation"
      aria-hidden={!open}
      className={open ? 'mobile-nav open' : 'mobile-nav'}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) onClose();
      }}
    >
      <div className="mobile-nav-header" aria-hidden="true">
        <span className="mobile-nav-brand">ADOBO</span>
      </div>
      <button
        ref={closeBtnRef}
        type="button"
        className="mobile-nav-close"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      >
        <X aria-hidden="true" />
      </button>
      <ul>
        {NAV_LINKS.map((link, index) => (
          <li key={link.href}>
            <a
              ref={index === 0 ? firstLinkRef : undefined}
              href={resolveHref(link.href)}
              tabIndex={open ? 0 : -1}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>,
    document.body
  );
}
