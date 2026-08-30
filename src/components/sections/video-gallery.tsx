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
 * Last-resort poster — only used when the JSON entry has no `poster` field
 * AND the in-viewport frame capture (see `useVideoFrame`) hasn't produced
 * one yet. A tiny SVG keeps the card a clean dark rectangle until the
 * real thumbnail is decoded (~600 bytes vs. tens of KB).
 */
const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 36"><rect width="64" height="36" fill="#0d0b09"/></svg>'
  );

/**
 * Lazy frame capture — used only as a fallback when no `poster` URL is
 * supplied in the JSON. Skipped while the card is off-screen, so the
 * first paint of a 4K video on the homepage doesn't trigger a metadata
 * download for every clip in the grid. A muted inline
 * `<video preload="metadata">` is created off-DOM, seeks to ~0.2s, draws
 * the frame to a canvas, and exports a small JPEG data URL the parent
 * component can pass to `<video poster>`.
 */
function useVideoFrame(src: string, enabled: boolean, seekTo = 0.2): string | undefined {
  const [frame, setFrame] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled || !src) return;
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = src;

    const capture = () => {
      if (cancelled || video.videoWidth === 0) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      const max = 640;
      const scale = Math.min(1, max / w);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setFrame(canvas.toDataURL('image/jpeg', 0.75));
      } catch {
        // Cross-origin or tainted canvas — fall through, leave poster blank.
      }
    };

    const onLoaded = () => {
      const rafSeek = () => {
        try {
          video.currentTime = Math.min(seekTo, (video.duration || seekTo) - 0.05);
        } catch {
          capture();
        }
      };
      if ('requestVideoFrameCallback' in video) {
        (
          video as HTMLVideoElement & { requestVideoFrameCallback: (cb: () => void) => number }
        ).requestVideoFrameCallback(rafSeek);
      } else {
        rafSeek();
      }
    };

    const onSeeked = () => capture();
    const onError = () => {
      // Decoder failed or codec unsupported — keep the dark fallback poster.
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      video.src = '';
    };
  }, [src, enabled, seekTo]);

  return frame;
}

function LocalVideoPlayer({ video, lazy }: { video: LocalVideo; lazy?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(!lazy);
  // Only fetch a frame from the video itself if no static poster was set
  // in the JSON. A pre-generated poster is ~30 KB and instant; the
  // frame-capture path downloads video metadata (~hundreds of KB) just to
  // grab one JPEG, so we want to avoid it on mobile whenever possible.
  const hasStaticPoster = Boolean(video.poster);
  const capturedFrame = useVideoFrame(inView ? asset(video.src) : '', inView && !hasStaticPoster);
  const posterSrc = video.poster ? asset(video.poster) : (capturedFrame ?? FALLBACK_POSTER);

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
          <span className="section-number seal-press" aria-hidden="true">
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
