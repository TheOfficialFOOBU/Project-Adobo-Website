import { CopyButton } from '@/components/copy-button';
import { DiscordPresenceBadge } from '@/components/discord-presence-badge';
import { GlowCta } from '@/components/glow-cta';
import { HeroScrollFx } from '@/components/hero-scroll-fx';
import { MagneticButton } from '@/components/magnetic-button';
import { fetchDiscordPresence } from '@/lib/discord';
import { DISCORD_INVITE, asset } from '@/lib/site';

/**
 * Root-relative URLs inside CSS can't be prefixed with the GitHub Pages
 * base path, so the hero art sources are injected here via asset() and
 * picked up by globals.css as custom properties.
 */
const HERO_BG_VARS = {
  '--hero-bg-sm': `url('${asset('/images/hero-bg-768.webp')}')`,
  '--hero-bg-md': `url('${asset('/images/hero-bg-1280.webp')}')`,
  '--hero-bg-lg': `url('${asset('/images/hero-bg-1920.webp')}')`,
} as React.CSSProperties;

/**
 * Hero 1 — full-screen intro with drifting orbs and entrance animations.
 * Async so the build can snapshot live Discord presence for the badge;
 * offline or blocked builds simply omit the badge.
 */
export async function HeroSection() {
  const presence = await fetchDiscordPresence();

  return (
    <section className="hero hero-animated" id="home" data-animate>
      {/* Hero preloads — hoisted to <head> by React 19; only loaded on the homepage. */}
      <link
        rel="preload"
        as="image"
        href={asset('/images/hero-bg-768.webp')}
        media="(max-width: 767px)"
      />
      <link
        rel="preload"
        as="image"
        href={asset('/images/hero-bg-1280.webp')}
        media="(min-width: 768px) and (max-width: 1535px)"
      />
      <link
        rel="preload"
        as="image"
        href={asset('/images/hero-bg-1920.webp')}
        media="(min-width: 1536px)"
      />
      <div className="hero-bg" aria-hidden="true" style={HERO_BG_VARS} />
      <div className="hero-frame" aria-hidden="true" />
      <span className="hero-mark hero-mark--right" aria-hidden="true">
        風起
      </span>
      <span className="hero-mark hero-mark--left" aria-hidden="true">
        刀鳴
      </span>
      <div className="hero-inner" data-animate>
        <h1>
          Where
          <br />
          we put
          <br />
          FUN in
          <br />
          FUNtastic
        </h1>
        <p className="subtitle">Where Winds Meet</p>
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
