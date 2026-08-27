'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { asset } from '@/lib/site';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Activities' },
  { href: '#team', label: 'Members' },
  { href: '#philosophy', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
] as const;

/**
 * Fixed site header with logo and main navigation.
 * The menu button toggles the off-canvas nav on small screens
 * (aria-expanded parity with the original implementation).
 *
 * Also hosts two ambient affordances:
 *  - scroll-spy: the nav link for the section crossing mid-viewport
 *    gets the gold underline (home page only; no-ops elsewhere)
 *  - scroll progress: a thin gold bar along the header's bottom edge
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector<HTMLElement>(link.href)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // Topmost visible section in nav order wins the highlight.
        const top = sections.find((section) => visible.has(section.id));
        setActiveSection(top ? top.id : '');
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const bar = progressRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = Array.from(
        nav.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header>
      <button
        type="button"
        className="menu-btn"
        id="menu-btn"
        aria-controls="site-nav"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <a href="#home" className="logo" aria-label="Home">
        <picture>
          <source
            type="image/webp"
            srcSet={`${asset('/images/logo-320.webp')} 320w, ${asset('/images/logo-480.webp')} 480w, ${asset('/images/logo-640.webp')} 640w`}
            sizes="48px"
          />
          <img
            src={asset('/images/logo-320.webp')}
            alt="Guild Logo"
            className="logo-image"
            width={42}
            height={42}
            decoding="async"
            loading="lazy"
          />
        </picture>
        <span className="logo-text">ADOBO</span>
      </a>
      <nav id="site-nav" aria-label="Main navigation" className={menuOpen ? 'open' : undefined}>
        <ul onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={activeSection === link.href.slice(1) ? 'active' : undefined}
                aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
    </header>
  );
}
