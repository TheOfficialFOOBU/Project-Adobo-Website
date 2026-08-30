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

function ActivityCard({
  activity,
  index,
  variant,
}: {
  activity: Activity;
  index: number;
  variant: 'feature' | 'standard';
}) {
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

  const open = () => openLightbox({ src: asset(activity.full), alt: activity.alt });

  return (
    <article
      className={cn('activity-card', `activity-card--${variant}`, loaded && 'loaded')}
      id={activity.id}
      onClick={open}
    >
      <div
        className={cn('activity-card-bg', loaded && 'hidden')}
        style={{ backgroundImage: `url(${asset(activity.lqip)})` }}
        aria-hidden="true"
      />
      <picture className={cn('skeleton-wrap', loaded ? 'loaded' : 'skeleton')}>
        <source type="image/webp" srcSet={assetSrcSet(activity.srcSet)} sizes="50vw" />
        <img
          ref={imgRef}
          className="lightbox-target"
          src={asset(activity.src)}
          alt={activity.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        />
      </picture>

      {/* Always-visible chronicle index — top-right */}
      <span className="activity-card-index" aria-hidden="true">
        No. {String(index + 1).padStart(2, '0')}
      </span>

      {/* Type tag — bottom-left, always visible */}
      <span className="activity-card-type">{activity.type}</span>

      {/* Hover caption panel */}
      <div className="activity-card-overlay">
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <span className="activity-card-cta">
          {activity.linkLabel}
          <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </article>
  );
}

/**
 * "Guild Activities" — editorial layout: the first item is a wide feature
 * card with the type tag and a layered overlay, the rest are 2-up standard
 * cards. Each card carries a chronicle number and shows its title on hover.
 * Progressive disclosure shows the first 4 cards; "Show more" reveals the rest.
 */
export function ActivitiesSection() {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const total = ACTIVITIES.length;
  const shown = ACTIVITIES.slice(0, visible);
  const remaining = total - visible;

  const featured = shown[0];
  const rest = shown.slice(1);

  return (
    <section className="projects guild-activities" id="projects" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Activities
          <span className="section-number seal-press" aria-hidden="true">
            壹
          </span>
        </h2>
        <p className="activities-lede">
          Chronicles from the road — milestones, pranks, and pictures we&apos;ll pretend were
          intentional.
        </p>

        {featured ? (
          <div className="activities-feature">
            <ActivityCard activity={featured} index={0} variant="feature" />
            <aside className="activities-feature-side">
              <span className="activities-feature-eyebrow">Featured Chronicle</span>
              <h3 className="activities-feature-title">{featured.title}</h3>
              <p className="activities-feature-body">{featured.description}</p>
              <span className="activities-feature-meta">
                <span className="activities-feature-type">{featured.type}</span>
              </span>
            </aside>
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="activities-grid">
            {rest.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i + 1}
                variant="standard"
              />
            ))}
          </div>
        ) : null}

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
