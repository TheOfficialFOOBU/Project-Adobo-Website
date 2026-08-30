import { CopyButton } from '@/components/copy-button';
import { DiscordPresenceBadge } from '@/components/discord-presence-badge';
import { GlowCta } from '@/components/glow-cta';
import { HeroScrollFx } from '@/components/hero-scroll-fx';
import { MagneticButton } from '@/components/magnetic-button';
import { fetchDiscordPresence } from '@/lib/discord';
import { DISCORD_INVITE, asset } from '@/lib/site';

/**
 * Hero — the cinematic first impression.
 *
 * Composition:
 *  - A cinnabar chapter stamp (壹) that presses into the page above the
 *    H1 — the signature animation that sets the brand beat.
 *  - The two vertical Chinese marks (風起 / 刀鳴) bracket the H1 from
 *    left and right, weighted toward the top-right and bottom-left.
 *  - The H1 ("Where we put FUN in FUNtastic") sits centered with a
 *    Cormorant italic accent on the two FUN words and a cinnabar
 *    underline.
 *  - "Where Winds Meet" subtitle, Adobo guild motto, Discord CTA row, and presence badge.
 *  - The two ink-mist pseudo-elements continue the atmosphere.
 *
 * Async so the build can snapshot live Discord presence for the badge;
 * offline or blocked builds simply omit the badge.
 */
export async function HeroSection() {
  const presence = await fetchDiscordPresence();

  return (
    <section className="hero hero-animated" id="home" data-animate>
      <picture className="hero-bg">
        <source
          media="(min-width: 1536px)"
          type="image/webp"
          srcSet={asset('/images/hero-bg-1920.webp')}
        />
        <source
          media="(min-width: 768px)"
          type="image/webp"
          srcSet={asset('/images/hero-bg-1280.webp')}
        />
        <img
          src={asset('/images/hero-bg-768.webp')}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div className="hero-frame" aria-hidden="true" />

      <div className="hero-inner" data-animate>
        {/* Chapter stamp — the signature animation. Sits above the H1
            and presses into place on first paint. Decorative only
            (aria-hidden). The dust pulse is a CSS radial-gradient +
            opacity, no PNG asset. */}
        <span className="hero-stamp" aria-hidden="true">
          <span className="hero-stamp-mark">壹</span>
          <span className="hero-stamp-dust" />
        </span>

        {/* Mango-leaf ink accent — experimental. Positioned absolutely
            to the LEFT of the chapter stamp so it doesn't fight the
            stamp for visual attention. Independent element. To remove:
            delete this <svg> and the .hero-leaf CSS rule. */}
        <svg
          className="hero-leaf"
          viewBox="0 0 40 40"
          width="72"
          height="72"
          aria-hidden="true"
          focusable="false"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z"
              transform="rotate(-3 20 20)"
            />
            <path d="M 21 37 L 21 38.5" strokeWidth="1.25" />
            <path
              d="M 21 36 C 20 28, 19 19, 21 11"
              strokeWidth="0.75"
              strokeOpacity="0.55"
              transform="rotate(-3 20 20)"
            />
          </g>
        </svg>

        {/* Adobo guild seal — small cinnabar circle with the first
            Chinese character of "Adobo" (阿) inside. Sits at the upper-
            RIGHT of the hero, mirroring the mango-leaf on the left, as
            a second Adobo-only visual mark. Independent element. To
            remove: delete this <svg> and the .hero-adobo-seal CSS rule. */}
        <svg
          className="hero-adobo-seal"
          viewBox="0 0 40 40"
          width="64"
          height="64"
          aria-hidden="true"
          focusable="false"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer circle: cinnabar ring */}
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" />
            {/* Inner ring: smaller concentric circle for layered seal feel */}
            <circle cx="20" cy="20" r="13" strokeWidth="0.5" />
            {/* 阿 character — drawn as path strokes (Cormorant-style
                ink-brush aesthetic). Simple geometric strokes that read
                as the character "阿" without using a font face. */}
            <path d="M 20 11 L 20 26" strokeWidth="2.5" />
            <path d="M 14 17 L 26 17" strokeWidth="1.5" />
            <path d="M 15 22 L 25 22" strokeWidth="1.5" />
            <path d="M 17 28 L 17 22" strokeWidth="1.5" />
            <path d="M 23 28 L 23 22" strokeWidth="1.5" />
            <path d="M 17 26 L 23 26" strokeWidth="1.5" />
            <path d="M 18 30 L 20 28 L 22 30" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Vertical calligraphic accents — wind rises, blade sings.
            Repositioned to bracket the H1 vertically. Slightly heavier
            weight than the previous edge-corner placement. */}
        <span className="hero-mark hero-mark--right" aria-hidden="true">
          風起
        </span>
        <span className="hero-mark hero-mark--left" aria-hidden="true">
          刀鳴
        </span>

        <h1>
          Where
          <br />
          we put
          <br />
          <span className="hero-fun-accent">FUN</span> in
          <br />
          <span className="hero-fun-accent">FUN</span>tastic
        </h1>
        {/* Adobo guild motto — a small editorial line that turns the hero
            from a game landing page into a guild landing page. Sits
            between the H1 and the CTA. */}
        <p className="hero-motto">We play because we want to, not because we have to.</p>
        <div className="hero-cta-row">
          <MagneticButton>
            <GlowCta className="cta-button glow" href={DISCORD_INVITE}>
              Join the Discord
            </GlowCta>
          </MagneticButton>
          <CopyButton value={DISCORD_INVITE} label="Copy invite" className="copy-invite-button" />
          <MagneticButton>
            <a className="cta-button light" href="#team">
              Meet the Guild
            </a>
          </MagneticButton>
        </div>
        {presence ? <DiscordPresenceBadge initial={presence} /> : null}
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        SCROLL
      </div>
      <HeroScrollFx />
    </section>
  );
}
