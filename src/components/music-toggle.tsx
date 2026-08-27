'use client';

import { Volume1, Volume2, VolumeX } from 'lucide-react';
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
  const [volume, setVolume] = useState(0.2);
  const [showSlider, setShowSlider] = useState(false);

  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSliderTemporarily = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowSlider(true);
    hideTimerRef.current = setTimeout(() => setShowSlider(false), 3000);
  }, []);

  const toggle = useCallback(async () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(asset('/audio/background.mp3'));
      audio.loop = true;
      audio.volume = volume;
      audio.preload = 'metadata';
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
      showSliderTemporarily();
    } catch {
      setPlaying(false);
    }
  }, [playing, volume, showSliderTemporarily]);

  const changeVolume = useCallback((newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  }, []);

  const VolumeIcon = !playing ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className="music-control"
      onMouseEnter={() => playing && setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {playing && showSlider ? (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className="music-volume-slider"
          aria-label="Volume"
        />
      ) : null}
      <button
        ref={toggleRef}
        type="button"
        className="music-toggle"
        aria-label={playing ? 'Pause background music' : 'Play background music'}
        aria-pressed={playing}
        onClick={() => void toggle()}
        onFocus={() => playing && setShowSlider(true)}
        onBlur={() => setShowSlider(false)}
      >
        <VolumeIcon aria-hidden="true" />
      </button>
    </div>
  );
}
