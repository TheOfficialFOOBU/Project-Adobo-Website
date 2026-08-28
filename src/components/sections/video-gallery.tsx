'use client';

import { useEffect, useRef, useState } from 'react';

import { asset } from '@/lib/site';
import { cn } from '@/lib/utils';

import videosData from '@/data/videos.json';

interface LocalVideo {
  type: 'local';
  id: string;
  src: string;
  title: string;
  label?: string;
  description: string;
  featured?: boolean;
}

const VIDEOS = videosData as LocalVideo[];
const COLLAPSED_GRID_COUNT = 3;

function LocalVideoPlayer({ video, lazy }: { video: LocalVideo; lazy?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
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

  return (
    <div ref={wrapperRef} className={cn('video-card', video.featured && 'video-card--featured')}>
      <div className="video-embed-wrapper">
        <video
          ref={videoRef}
          src={asset(video.src)}
          controls
          preload={inView ? 'metadata' : 'none'}
          playsInline
          title={video.title}
          className="video-embed loaded"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />

        {!playing && (
          <button
            type="button"
            className="video-play-overlay"
            aria-label={`Watch ${video.title}`}
            onClick={() => videoRef.current?.play()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
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
