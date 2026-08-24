'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface LightboxItem {
  /** Stable unique key used for registration. */
  id: string;
  /** Full-resolution image URL opened in the lightbox. */
  src: string;
  /** Caption / alt text. */
  alt: string;
  /**
   * Optional image shown if `src` fails to load (e.g. a missing
   * lossless variant) — keeps the viewer from showing a broken frame.
   */
  fallback?: string;
}

interface ActiveImage {
  src: string;
  alt: string;
  fallback?: string;
}

interface LightboxContextValue {
  /** Register an image as part of the prev/next traversal set. */
  register: (item: LightboxItem) => () => void;
  /** Open the lightbox for the given image. */
  openLightbox: (target: ActiveImage) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within <LightboxProvider>');
  return ctx;
}

/**
 * Full-screen image viewer — port of the original #lightbox behavior:
 * backdrop click, ✕ close, ‹ › navigation across every registered
 * .lightbox-target, Esc/ArrowLeft/ArrowRight keys, body scroll lock.
 *
 * The open image is mirrored to the URL hash (#activity-prison-break) so
 * any photo can be deep-linked; a matching hash opens the viewer on load.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [active, setActive] = useState<ActiveImage | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<Element | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  /**
   * Derived display URL: starts from the primary source and permanently
   * swaps to the fallback once that specific source has failed to load.
   */
  const displaySrc =
    active === null
      ? null
      : failedSrc === active.src && active.fallback
        ? active.fallback
        : active.src;

  const activeIndex = active ? items.findIndex((i) => i.src === active.src) : -1;

  const register = useCallback((item: LightboxItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
    return () => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    };
  }, []);

  const openLightbox = useCallback((target: ActiveImage) => {
    lastFocusedRef.current = document.activeElement;
    setActive(target);
  }, []);

  const value = useMemo(() => ({ register, openLightbox }), [register, openLightbox]);

  const restoreFocus = useCallback(() => {
    const el = lastFocusedRef.current;
    if (el instanceof HTMLElement) el.focus();
    lastFocusedRef.current = null;
  }, []);

  const closeLightbox = useCallback(() => {
    setActive(null);
    restoreFocus();
  }, [restoreFocus]);

  const showPrev = useCallback(() => {
    if (!active) return;
    const index = items.findIndex((i) => i.src === active.src);
    const prev = index > 0 ? items[index - 1] : undefined;
    if (prev) setActive({ src: prev.src, alt: prev.alt, fallback: prev.fallback });
  }, [items, active]);

  const showNext = useCallback(() => {
    if (!active) return;
    const index = items.findIndex((i) => i.src === active.src);
    const next = index >= 0 && index < items.length - 1 ? items[index + 1] : undefined;
    if (next) setActive({ src: next.src, alt: next.alt, fallback: next.fallback });
  }, [items, active]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'Tab') {
        // Focus trap: cycle through the lightbox's buttons (✕ ‹ ›).
        const container = containerRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>('button:not([disabled])')
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;
        const inside = current !== null && container.contains(current);
        if (event.shiftKey && (!inside || current === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || current === last)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [active, closeLightbox, showPrev, showNext]);

  /* ---------- URL-hash deep linking ---------- */

  // Initial deep links (#activity-prison-break) are opened by each card's
  // registration effect in activities.tsx, where the id → image mapping
  // lives. The provider only mirrors state outward and reacts to changes.

  // Mirror the open image into the hash; clear it on close. replaceState is
  // used deliberately — no history spam and no hashchange feedback loop.
  useEffect(() => {
    if (active === null) {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      return;
    }
    const id = items.find((item) => item.src === active.src)?.id;
    const desired = id ? `#${id}` : '';
    if (window.location.hash !== desired) {
      history.replaceState(
        null,
        '',
        desired || `${window.location.pathname}${window.location.search}`
      );
    }
  }, [active, items]);

  // React to manual hash edits (e.g. pasting a shared link in the same tab).
  useEffect(() => {
    const onHashChange = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!id) {
        setActive(null);
        return;
      }
      const match = items.find((item) => item.id === id);
      if (match) setActive({ src: match.src, alt: match.alt, fallback: match.fallback });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [items]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {active ? (
        <div
          id="lightbox"
          ref={containerRef}
          className="open"
          role="dialog"
          aria-modal="true"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStartRef.current;
            touchStartRef.current = null;
            if (!start) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            // Horizontal swipe only — vertical scrolls must not page images.
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
              if (dx < 0) showNext();
              else showPrev();
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="lb-inner">
            <button
              type="button"
              ref={closeBtnRef}
              className="lb-close"
              aria-label="Close"
              onClick={closeLightbox}
            >
              <X aria-hidden="true" />
            </button>
            {activeIndex > -1 && items.length > 1 ? (
              <div className="lb-counter" aria-hidden="true">
                {activeIndex + 1} / {items.length}
              </div>
            ) : null}
            <div className="lb-nav">
              <button type="button" id="lb-prev" aria-label="Previous" onClick={showPrev}>
                <ChevronLeft aria-hidden="true" />
              </button>
              <button type="button" id="lb-next" aria-label="Next" onClick={showNext}>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
            <div className="text-center w-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox displays pre-generated full-size assets */}
              <img
                id="lb-image"
                alt={active.alt}
                src={displaySrc ?? active.src}
                onError={() => setFailedSrc(active.src)}
              />
              <div id="lb-caption" className="lb-caption">
                {active.alt}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
