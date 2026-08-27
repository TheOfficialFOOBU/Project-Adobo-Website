'use client';

import { useRef, useState } from 'react';

import { asset, assetSrcSet } from '@/lib/site';
import { cn } from '@/lib/utils';

/** "Our Guild Philosophy" split with guild photo. */
export function PhilosophySection() {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <section className="philosophy" id="philosophy" data-animate>
      <div className="container">
        <h2 className="section-title">
          Our Guild Philosophy
          <span className="section-number" aria-hidden="true">
            參
          </span>
        </h2>
        <div className="philosophy-content">
          <div>
            <h3>
              Forged
              <br />
              Together
            </h3>
            <p>
              Adobo is not built by chance it is forged through trust, discipline, and shared
              purpose. We are more than players chasing victories; we are individuals bound by
              respect, loyalty, and growth. Every member carries the guild&apos;s name not just in
              battle, but in character. We rise together, we improve together, and we never leave
              our own behind.
            </p>
            <a className="cta-button light" href="#contact">
              Join Our Guild
            </a>
          </div>
          <picture className={cn('skeleton-wrap', loaded ? 'loaded' : 'skeleton')}>
            <source
              type="image/webp"
              srcSet={assetSrcSet(
                '/images/events/3-1600.webp 1600w, /images/events/3-1024.webp 1024w, /images/events/3-800.webp 800w, /images/events/3-640.webp 640w, /images/events/3-480.webp 480w, /images/events/3-320.webp 320w'
              )}
              sizes="(max-width:600px) 100vw, 50vw"
            />
            <img
              ref={imgRef}
              src={asset('/images/events/3-1024.webp')}
              alt="Guild Philosophy"
              style={{ maxWidth: '100%', height: 'auto' }}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
