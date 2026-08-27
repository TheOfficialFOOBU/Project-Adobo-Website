'use client';

import { useRef, useState } from 'react';

import { asset } from '@/lib/site';
import { cn } from '@/lib/utils';

import videosData from '@/data/videos.json';

interface TikTokVideo {
  type: 'tiktok';
  id: string;
  embedId: string;
  title: string;
  description: string;
  featured?: boolean;
}

interface LocalVideo {
  type: 'local';
  id: string;
  src: string;
  title: string;
  description: string;
  featured?: boolean;
}

type Video = TikTokVideo | LocalVideo;

const VIDEOS = videosData as Video[];

function TikTokEmbed({ video }: { video: TikTokVideo }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('video-card', video.featured && 'video-card--featured')}>
      <div className="video-embed-wrapper">
        {!loaded && <div className="skeleton-bg" aria-hidden="true" />}
        <iframe
          src={`https://www.tiktok.com/embed/v2/${video.embedId}`}
          title={video.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn('video-embed', loaded && 'loaded')}
        />
      </div>
      <div className="video-info">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </div>
  );
}

function LocalVideoPlayer({ video }: { video: LocalVideo }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn('video-card', video.featured && 'video-card--featured')}>
      <div className="video-embed-wrapper">
        <video
          ref={videoRef}
          src={asset(video.src)}
          controls
          preload="metadata"
          playsInline
          className="video-embed loaded"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <track kind="captions" />
        </video>
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
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </div>
  );
}

/** "Guild Videos" — TikTok embeds + locally hosted Discord clips. */
export function VideoGallerySection() {
  const featured = VIDEOS.find((v) => v.featured);
  const rest = VIDEOS.filter((v) => !v.featured);

  return (
    <section className="video-gallery" id="videos" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Videos
          <span className="section-number" aria-hidden="true">
            伍
          </span>
        </h2>

        {featured && (
          <div className="video-featured">
            {featured.type === 'tiktok' ? (
              <TikTokEmbed video={featured} />
            ) : (
              <LocalVideoPlayer video={featured} />
            )}
          </div>
        )}

        {rest.length > 0 && (
          <div className="video-grid">
            {rest.map((video) =>
              video.type === 'tiktok' ? (
                <TikTokEmbed key={video.id} video={video} />
              ) : (
                <LocalVideoPlayer key={video.id} video={video} />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
