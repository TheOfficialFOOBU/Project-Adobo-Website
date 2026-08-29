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

/** "Peace-first / Fun-obsessed" intro split. */
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

const WHAT_WE_DO_PILLARS = [
  {
    seal: '壹',
    title: 'We play at our own pace',
    body: 'No pressure, no expectations, no unnecessary hassle. Adobo was built for players who want a casual, stress-free place to enjoy Where Winds Meet while building genuine friendships and camaraderie along the way.',
  },
  {
    seal: '貳',
    title: 'We fight together, laugh together',
    body: "We're not here to be the strongest or most competitive guild. When it comes to GvG, we fight together, have fun together, and laugh whether we win or lose. Winning is great, losing is funny, and neither changes what we're here for.",
  },
  {
    seal: '參',
    title: 'Real life comes first',
    body: "We don't impose strict rules or demand constant activity. Whether you're online every day or only have time to play occasionally, there's always a place for you here.",
  },
  {
    seal: '肆',
    title: 'Peace, respect, belonging',
    body: 'Above everything else, we value peace, respect, friendship, and a sense of belonging. We want Adobo to be a place where people can relax, meet good friends, share laughs, and enjoy the journey without unnecessary drama.',
  },
  {
    seal: '伍',
    title: 'It was never about the game',
    body: "Because at the end of the day, it's not about how we play the game — it's about the people we share it with.",
  },
];

/** "What we do" split (right-aligned) — restructured into scannable pillars. */
export function WhatWeDoSection() {
  return (
    <section className="hero-2 hero-2--with-decor hero-2--decor-left" data-animate>
      <SplitDecor srcSet={WHAT_DECOR} fallback="/images/events/GPIC2-1024.webp" />
      <div className="hero-2-content right-aligned">
        <h2>What we do</h2>
        <p className="what-we-do-lede">Five small promises. Read the ones you need.</p>
        <ol className="what-we-do-pillars">
          {WHAT_WE_DO_PILLARS.map((pillar) => (
            <li className="what-we-do-pillar" key={pillar.seal}>
              <span className="what-we-do-seal" aria-hidden="true">
                {pillar.seal}
              </span>
              <div>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <a className="cta-button" href="#philosophy">
          Learn More
        </a>
      </div>
    </section>
  );
}
