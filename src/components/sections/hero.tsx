import { CopyButton } from '@/components/copy-button';
import { DiscordPresenceBadge } from '@/components/discord-presence-badge';
import { GlowCta } from '@/components/glow-cta';
import { HeroScrollFx } from '@/components/hero-scroll-fx';
import { MagneticButton } from '@/components/magnetic-button';
import { fetchDiscordPresence } from '@/lib/discord';
import { DISCORD_INVITE, asset } from '@/lib/site';

/**
 * Hero — full-screen intro with drifting orbs and entrance animations.
 * Async so the build can snapshot live Discord presence for the badge;
 * offline or blocked builds simply omit the badge.
 *
 * The art is rendered as a real <picture> + <img> (not a CSS background)
 * so the browser can prioritize it with `fetchpriority="high"`, decode
 * it off the main thread, and skip the network round-trip CSS backgrounds
 * often incur. The parallax still works by moving the <img> via a
 * compositor-friendly transform in HeroScrollFx.
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
          // Highest-priority fetch + eager decode: this is the LCP element
          // on the homepage. The LQIP gradient on the <picture> shows while
          // the image streams in.
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
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
