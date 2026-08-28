'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { asset, DISCORD_INVITE } from '@/lib/site';

/**
 * “Contact Leader” modal — Radix Dialog (shadcn/ui) styled with the original
 * Adobo modal CSS (gradient card, orange top bar, slide-in spring, rotating
 * ✕). Focus trap, Esc and backdrop close come from the primitive, matching
 * the original behavior.
 */
export function ContactLeaderDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="cta-button light" id="contact-leader-btn">
          Contact Leader
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="modal-overlay" />
        <DialogContent className="modal-positioner" aria-labelledby="contact-modal-title">
          <div className="modal-content">
            <DialogClose className="close-modal" aria-label="Close">
              &times;
            </DialogClose>
            <DialogTitle className="modal-title" id="contact-modal-title">
              Contact Guild Leader
            </DialogTitle>
            <div className="leader-info">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${asset('/images/members/FOOBU-lossless-1024.webp')} 1024w, ${asset('/images/members/FOOBU-lossless-640.webp')} 640w`}
                  sizes="100w"
                />
                <img
                  src={asset('/images/members/FOOBU-lossless-640.webp')}
                  alt="FOOBU - Guild Leader"
                  className="leader-avatar"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <h4>FOOBU</h4>
              <DialogDescription className="leader-title">Guild Leader • DPS</DialogDescription>
              <p className="leader-quote">&quot;Isang Quarter Pounder lang sapat na.&quot;</p>
            </div>
            <div className="leader-socials">
              <h4>Find me on:</h4>
              <div className="social-links-grid">
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Discord"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- original SVG icon assets */}
                  <img
                    src={asset('/images/icons/discord.svg')}
                    className="social-icon"
                    alt="Discord"
                  />
                  <span className="social-name">Discord</span>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
