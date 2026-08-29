'use client';

import { useEffect, useRef, useState } from 'react';

import { asset } from '@/lib/site';
import { cn } from '@/lib/utils';

import videosData from '@/data/videos.json';

interface LocalVideo {
  type: 'local';
  id: string;
  src: string;
  poster?: string;
  title: string;
  label?: string;
  description: string;
  featured?: boolean;
}

const VIDEOS = videosData as LocalVideo[];
const COLLAPSED_GRID_COUNT = 3;

/**
 * Inline SVG poster used when a video has no real thumbnail. Includes the
 * guild mark so the empty card still reads as "video to play" without
 * ever sitting in front of the native controls.
 */
const PLACEHOLDER_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1a1611"/>' +
      '<stop offset="100%" stop-color="#0d0b09"/>' +
      '</linearGradient></defs>' +
      '<rect width="640" height="360" fill="url(#g)"/>' +
      '<g fill="none" stroke="#c9a45c" stroke-opacity="0.35" stroke-width="1">' +
      '<rect x="20" y="20" width="600" height="320" rx="4"/>' +
      '<path d="M20 20 L40 40 M620 20 L600 40 M20 340 L40 320 M620 340 L600 320"/>' +
      '</g>' +
      '<text x="50%" y="48%" text-anchor="middle" fill="#c9a45c" ' +
      'fill-opacity="0.7" font-family="serif" font-size="22" letter-spacing="6">ADOBO</text>' +
      '<text x="50%" y="58%" text-anchor="middle" fill="#ede5d3" ' +
      'fill-opacity="0.55" font-family="sans-serif" font-size="13" letter-spacing="3">GUILD CLIP</text>' +
      '</svg>'
  );

function LocalVideoPlayer({ video, lazy }: { video: LocalVideo; lazy?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(!lazy);

  useEffect(() => {
    if (!lazy || inView) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, inView]);

  const posterSrc = video.poster ? asset(video.poster) : PLACEHOLDER_POSTER;

  return (
    <div ref={wrapperRef} className={cn('video-card', video.featured && 'video-card--featured')}>
      <div className="video-embed-wrapper">
        <video
          ref={videoRef}
          src={asset(video.src)}
          controls
          controlsList="nodownload"
          preload={inView ? 'metadata' : 'none'}
          playsInline
          // iOS Safari requires a real user gesture on the <video> element
          // (or its native controls) to start playback. We deliberately do
          // NOT layer a custom play button on top of the native controls —
          // any overlay can swallow the tap, block the controls from
          // appearing, and Safari will refuse to start the play.
          disablePictureInPicture
          poster={posterSrc}
          title={video.title}
          className="video-embed"
        />
      </div>
      <div className="video-info">
        {video.label && <span className="video-label">{video.label}</span>}
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </div>
  );
}

/** "Guild Videos" — locally hosted Discord clips. */
export function VideoGallerySection() {
  const [expanded, setExpanded] = useState(false);
  const featured = VIDEOS.find((v) => v.featured);
  const rest = VIDEOS.filter((v) => !v.featured);
  const visibleRest = expanded ? rest : rest.slice(0, COLLAPSED_GRID_COUNT);
  const hasMore = rest.length > COLLAPSED_GRID_COUNT;

  return (
    <section className="video-gallery" id="videos" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Videos
          <span className="section-number" aria-hidden="true">
            陸
          </span>
        </h2>

        {featured && (
          <div className="video-featured">
            <LocalVideoPlayer video={featured} />
          </div>
        )}

        {visibleRest.length > 0 && (
          <div className="video-grid">
            {visibleRest.map((video) => (
              <LocalVideoPlayer key={video.id} video={video} lazy />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="video-toggle-wrap">
            <button
              type="button"
              className="chip"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : `Show more (${rest.length - COLLAPSED_GRID_COUNT})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
