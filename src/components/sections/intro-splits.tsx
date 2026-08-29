'use client';

import { useEffect, useRef, useState } from 'react';

import { asset, assetSrcSet } from '@/lib/site';
import { cn } from '@/lib/utils';

const PEACE_DECOR =
  '/images/events/Gpic3-1600.webp 1600w, /images/events/Gpic3-1024.webp 1024w, /images/events/Gpic3-800.webp 800w, /images/events/Gpic3-640.webp 640w, /images/events/Gpic3-480.webp 480w, /images/events/Gpic3-320.webp 320w';

const WHAT_DECOR =
  '/images/events/GPIC2-1600.webp 1600w, /images/events/GPIC2-1024.webp 1024w, /images/events/GPIC2-800.webp 800w, /images/events/GPIC2-640.webp 640w, /images/events/GPIC2-480.webp 480w, /images/events/GPIC2-320.webp 320w';

/** Responsive background image shown behind / beside a split section. */
function SplitDecor({ srcSet, fallback }: { srcSet: string; fallback: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Cached images can finish before hydration — settle the loaded flag from
  // the actual <img> state on mount so we don't flicker the skeleton.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <picture className={cn('hero-2-decor', loaded && 'loaded')}>
      <source type="image/webp" srcSet={assetSrcSet(srcSet)} sizes="50vw" />
      <img
        ref={imgRef}
        className="hero-2-decor-img"
        src={asset(fallback)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </picture>
  );
}

/** “Peace-first / Fun-obsessed” intro split. */
export function WarriorLedSection() {
  return (
    <section className="hero-2 hero-2--with-decor hero-2--decor-right" data-animate>
      <SplitDecor srcSet={PEACE_DECOR} fallback="/images/events/Gpic3-1024.webp" />
      <div className="hero-2-content">
        <h2>
          Peace-first
          <br />
          Fun-obsessed
        </h2>
        <p>
          A guild in Where Winds Meet built as a safe haven for those who simply want to relax, have
          fun, and enjoy the game with good people.
        </p>
        <a className="cta-button light" href="#projects">
          Explore Guild
        </a>
      </div>
    </section>
  );
}

/** “What we do” split (right-aligned). */
export function WhatWeDoSection() {
  return (
    <section className="hero-2 hero-2--with-decor hero-2--decor-left" data-animate>
      <SplitDecor srcSet={WHAT_DECOR} fallback="/images/events/GPIC2-1024.webp" />
      <div className="hero-2-content right-aligned">
        <h2>What we do</h2>
        <p>
          We play at our own pace, without pressure, expectations, or unnecessary hassle. Adobo was
          built for players who want a casual, stress-free place to enjoy Where Winds Meet while
          building genuine friendships and camaraderie along the way.
        </p>
        <p>
          We&apos;re not here to be the strongest or most competitive guild. When it comes to GvG,
          we fight together, have fun together, and laugh whether we win or lose. Winning is great,
          losing is funny, and neither changes what we&apos;re here for.
        </p>
        <p>
          We don&apos;t impose strict rules or demand constant activity. We understand that real
          life comes first, and games should be a way to unwind not another responsibility. Whether
          you&apos;re online every day or only have time to play occasionally, there&apos;s always a
          place for you here.
        </p>
        <p>
          Above everything else, we value peace, respect, friendship, and a sense of belonging. We
          want Adobo to be a place where people can relax, meet good friends, share laughs, and
          enjoy the journey without unnecessary drama.
        </p>
        <p>
          Because at the end of the day, it&apos;s not about how we play the game&mdash;it&apos;s
          about the people we share it with.
        </p>
        <a className="cta-button" href="#philosophy">
          Learn More
        </a>
      </div>
    </section>
  );
}
