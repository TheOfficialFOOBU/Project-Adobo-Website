'use client';

import { useEffect, useRef, useState } from 'react';

import activitiesData from '@/data/activities.json';
import { useLightbox } from '@/components/lightbox-provider';
import { asset, assetSrcSet } from '@/lib/site';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  /** Mid-size WebP used as the <img> fallback/initial source. */
  src: string;
  srcSet: string;
  full: string;
  lqip: string;
  alt: string;
  type: string;
  title: string;
  description: string;
  linkLabel: string;
}

const ACTIVITIES = activitiesData as Activity[];

/** Initial card count rendered before the user opts into the rest. */
const INITIAL_COUNT = 4;

function ActivityCard({ activity }: { activity: Activity }) {
  const { register, openLightbox } = useLightbox();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const unregister = register({
      id: activity.id,
      src: asset(activity.full),
      alt: activity.alt,
    });
    // Deep link: a #hash matching this card's id opens its image directly.
    const wanted = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (wanted === activity.id) {
      openLightbox({ src: asset(activity.full), alt: activity.alt });
    }
    return unregister;
  }, [register, openLightbox, activity.id, activity.full, activity.alt]);

  // Cached images can complete before hydration attaches onLoad/onError —
  // settle the skeleton from img state on mount (same fix as MemberCard).
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className={cn('project-card', loaded && 'loaded')} id={activity.id}>
      <div
        className={cn('skeleton-bg', loaded && 'hidden')}
        style={{ backgroundImage: `url(${asset(activity.lqip)})` }}
        aria-hidden="true"
      />
      <picture className={cn('skeleton-wrap', loaded ? 'loaded' : 'skeleton')}>
        <source
          type="image/webp"
          srcSet={assetSrcSet(activity.srcSet)}
          sizes="(max-width:600px) 100vw, 45vw"
        />
        <img
          ref={imgRef}
          className="lightbox-target"
          src={asset(activity.src)}
          alt={activity.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          onClick={() => openLightbox({ src: asset(activity.full), alt: activity.alt })}
        />
      </picture>
      <div className="project-overlay">
        <div className="project-type">{activity.type}</div>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <a
          href={asset(activity.full)}
          onClick={(e) => {
            e.preventDefault();
            openLightbox({ src: asset(activity.full), alt: activity.alt });
          }}
        >
          {activity.linkLabel}
        </a>
      </div>
    </div>
  );
}

/** “Guild Activities” grid — hover overlay, skeleton/LQIP loading, lightbox,
 *  progressive disclosure (first 4 cards, “Show more” button reveals the rest). */
export function ActivitiesSection() {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const total = ACTIVITIES.length;
  const shown = ACTIVITIES.slice(0, visible);
  const remaining = total - visible;

  return (
    <section className="projects" id="projects" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Activities
          <span className="section-number" aria-hidden="true">
            壹
          </span>
        </h2>
        <div className="projects-grid">
          {shown.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
        {remaining > 0 ? (
          <div className="projects-more">
            <button
              type="button"
              className="cta-button light"
              onClick={() => setVisible((v) => Math.min(v + INITIAL_COUNT, total))}
              aria-label={`Show ${Math.min(remaining, INITIAL_COUNT)} more activities`}
            >
              Show more
              <span className="projects-more-count" aria-hidden="true">
                +{Math.min(remaining, INITIAL_COUNT)}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
