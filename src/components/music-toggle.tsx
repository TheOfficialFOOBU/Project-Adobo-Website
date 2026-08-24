'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { asset } from '@/lib/site';

/**
 * Background music toggle — OFF by default (the old auto-start-on-first-click
 * surprised people); the pill button bottom-left starts/stops the looping
 * track at 20% volume. The audio element is created lazily on first play so
 * nothing is downloaded until the user asks for it.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(async () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(asset('/audio/background.mp3'));
      audio.loop = true;
      audio.volume = 0.2;
      audio.preload = 'none';
      audioRef.current = audio;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, [playing]);

  return (
    <button
      type="button"
      className="music-toggle"
      aria-label="Toggle background music"
      aria-pressed={playing}
      onClick={() => void toggle()}
    >
      {playing ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </button>
  );
}
