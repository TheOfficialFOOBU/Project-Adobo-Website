'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  /** Optional short curator's note (one sentence) shown below the title. */
  curatorNote?: string;
  /** Optional ISO timestamp or date string — used for "newest" selection. */
  capturedAt?: string;
  /** Optional category tag (e.g., "Boss Fight", "Funny Moment"). */
  category?: string;
  /** Optional clip length in M:SS (e.g. "0:42"). Measured from the file,
   *  not estimated. Rendered as a small duration badge on supporting cards. */
  duration?: string;
}

const VIDEOS = videosData as LocalVideo[];
const CHAPTER_MARKS = ['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌'];

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

function FeaturedVideo({ video }: { video: LocalVideo }) {
  return <VideoEmbed video={video} variant="featured" />;
}

function SupportingVideo({ video, chapter }: { video: LocalVideo; chapter: string }) {
  return <VideoEmbed video={video} variant="supporting" chapter={chapter} />;
}

function VideoEmbed({
  video,
  variant,
  chapter,
}: {
  video: LocalVideo;
  variant: 'featured' | 'supporting';
  chapter?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lazy = variant === 'supporting';
  const [inView, setInView] = useState(!lazy);
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

  const isFeatured = variant === 'featured';

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'chronicles-video',
        isFeatured ? 'chronicles-video--featured' : 'chronicles-video--supporting'
      )}
    >
      <div className="chronicles-video-frame" aria-hidden="true">
        <span className="chronicles-video-bracket chronicles-video-bracket--tl" />
        <span className="chronicles-video-bracket chronicles-video-bracket--br" />
      </div>
      {/* Subtle play affordance — pure decoration (pointer-events: none, aria-hidden).
          Native <video controls> stay primary; iOS Safari requires an actual user
          gesture on the <video> element, which a custom overlay button would block. */}
      <span className="chronicles-video-play-affordance" aria-hidden="true">
        <svg viewBox="0 0 12 12" focusable="false">
          <path d="M3 1.5 L10 6 L3 10.5 Z" fill="currentColor" />
        </svg>
      </span>
      <div className="chronicles-video-embed">
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
          className="chronicles-video-player"
        />
      </div>
      <div className="chronicles-video-info">
        <div className="chronicles-video-info-head">
          {!isFeatured && chapter ? (
            <span className="chronicles-video-chapter" aria-hidden="true">
              {chapter}
            </span>
          ) : null}
          {isFeatured ? (
            <span className="chronicles-video-feature-tag" aria-hidden="true">
              Featured Memory
            </span>
          ) : null}
          {video.category ? (
            <span className="chronicles-video-category">{video.category}</span>
          ) : null}
        </div>
        <h3 className="chronicles-video-title">{video.title}</h3>
        {video.curatorNote ? <p className="chronicles-video-curator">{video.curatorNote}</p> : null}
        <p className="chronicles-video-description">{video.description}</p>
        {video.duration ? (
          <span className="chronicles-video-duration" aria-label={`Clip length: ${video.duration}`}>
            {video.duration}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * "Guild Chronicles" — the curated video showcase. Concept A: featured
 * main event above, 2x2 supporting grid below. Uses existing
 * chapter-mark vocabulary (壹貳參肆) for the supporting clips and
 * Cormorant display typography for the editorial beat.
 */
export function VideoGallerySection() {
  const videos = useMemo(() => VIDEOS, []);
  const featured = videos.find((v) => v.featured) ?? videos[0];
  const supporting = videos.filter((v) => v.id !== featured.id);

  return (
    <section className="video-gallery chronicles" id="videos" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Chronicles
          <span className="section-number seal-press" aria-hidden="true">
            陸
          </span>
        </h2>
        <p className="chronicles-lede">
          Memorable moments from the road — the kind worth replaying on a slow evening.
        </p>

        {/* Editorial eyebrow that frames the featured memory as a curated
            premiere — same magazine/programmatic vocabulary used by the
            Activities eyebrow and section labels. Cinnabar, italic Cormorant,
            sits between the lede and the featured card so the featured card
            reads as "now showing" rather than "the first media block." */}
        <p className="chronicles-now-showing" aria-hidden="true">
          Now showing
        </p>

        {featured ? <FeaturedVideo video={featured} /> : null}

        {supporting.length > 0 ? (
          <div className="chronicles-grid" role="list">
            {supporting.map((video, idx) => (
              <div key={video.id} role="listitem">
                <SupportingVideo
                  video={video}
                  chapter={CHAPTER_MARKS[idx % CHAPTER_MARKS.length] ?? '壹'}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
