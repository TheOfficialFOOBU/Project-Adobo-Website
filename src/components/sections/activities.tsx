'use client';

import { useEffect, useRef, useState } from 'react';

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

const ACTIVITIES: Activity[] = [
  {
    id: 'activity-guild-picture',
    src: '/images/events/2-800.webp',
    srcSet:
      '/images/events/2-1600.webp 1600w, /images/events/2-1024.webp 1024w, /images/events/2-800.webp 800w, /images/events/2-640.webp 640w, /images/events/2-480.webp 480w, /images/events/2-320.webp 320w',
    full: '/images/events/2-1600.webp',
    lqip: '/images/events/2-320.webp',
    alt: '100 Casual Raids',
    type: 'Guild Milestone',
    title: '‘Guild Picture Taking’',
    description: 'Our biggest member count guild picture.',
    linkLabel: 'View Milestone',
  },
  {
    id: 'activity-first-picture',
    src: '/images/events/Pogi-800.webp',
    srcSet:
      '/images/events/Pogi-1600.webp 1600w, /images/events/Pogi-1024.webp 1024w, /images/events/Pogi-800.webp 800w, /images/events/Pogi-640.webp 640w, /images/events/Pogi-480.webp 480w, /images/events/Pogi-320.webp 320w',
    full: '/images/events/Pogi-1600.webp',
    lqip: '/images/events/Pogi-320.webp',
    alt: 'Community United',
    type: 'Community Bond',
    title: '‘First Ever Guild Picture’',
    description: 'The first picture we took as a Guild since expanding from a 5 Member Guild.',
    linkLabel: 'View Achievement',
  },
  {
    id: 'activity-prison-break',
    src: '/images/events/1.JPG-800.webp',
    srcSet:
      '/images/events/1.JPG-1600.webp 1600w, /images/events/1.JPG-1024.webp 1024w, /images/events/1.JPG-800.webp 800w, /images/events/1.JPG-640.webp 640w, /images/events/1.JPG-480.webp 480w, /images/events/1.JPG-320.webp 320w',
    full: '/images/events/1.JPG-1600.webp',
    lqip: '/images/events/1.JPG-320.webp',
    alt: 'Tournament Victory',
    type: 'Funny Prison Break',
    title: '‘Prison Break’',
    description:
      "We tried to do Prison Break as Guild and ended up getting swarmed and camped. It's still funny to think as of this day.",
    linkLabel: 'View the Demolition',
  },
  {
    id: 'activity-nmw',
    src: '/images/events/4-800.webp',
    srcSet:
      '/images/events/4-1600.webp 1600w, /images/events/4-1024.webp 1024w, /images/events/4-800.webp 800w, /images/events/4-640.webp 640w, /images/events/4-480.webp 480w, /images/events/4-320.webp 320w',
    full: '/images/events/4-1600.webp',
    lqip: '/images/events/4-320.webp',
    alt: 'Guild Picnic',
    type: 'NMW Prank Guild Picture',
    title: "‘We Got NMW'd during Picture Taking’",
    description: 'waterlloyd used the NMW trick during our guild picture session.',
    linkLabel: 'View Event',
  },
];

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

/** “Guild Activities” grid — hover overlay, skeleton/LQIP loading, lightbox. */
export function ActivitiesSection() {
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
          {ACTIVITIES.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
}
