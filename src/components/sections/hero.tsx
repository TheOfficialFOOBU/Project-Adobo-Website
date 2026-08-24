import { GlowCta } from '@/components/glow-cta';
import { HeroScrollFx } from '@/components/hero-scroll-fx';
import { asset } from '@/lib/site';

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

/** Hero 1 — full-screen intro with drifting orbs and entrance animations. */
export function HeroSection() {
  return (
    <section className="hero hero-animated" id="home" data-animate>
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
          We
          <br />
          Play
          <br />
          For
          <br />
          Fun
        </h1>
        <p className="subtitle">Where Winds Meet</p>
        <div className="hero-cta-row">
          <GlowCta className="cta-button glow" href="https://discord.gg/NdZXkmYJnS">
            Join the Discord
          </GlowCta>
          <a className="cta-button light" href="#team">
            Meet the Guild
          </a>
        </div>
      </div>
      <div className="scroll-indicator">SCROLL</div>
      <HeroScrollFx />
    </section>
  );
}
