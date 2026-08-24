'use client';

import { ArrowRight, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLightbox } from '@/components/lightbox-provider';
import {
  imageBase,
  initialsPlaceholder,
  memberFullImage,
  memberImageFallbacks,
  memberSlug,
  type GuildMember,
} from '@/lib/members';
import { asset } from '@/lib/site';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: GuildMember;
}

/**
 * 3D flip card — click / Enter / Space flips the card, clicking the photo
 * opens the lightbox with the full-resolution image. Image loading uses the
 * original responsive WebP variants with the fallback chain + initials
 * placeholder ported from script.js.
 */
export function MemberCard({ member }: MemberCardProps) {
  const { register, openLightbox } = useLightbox();
  const [flipped, setFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(-1); // -1 = original src, then fallbacks, then placeholder
  const photoRef = useRef<HTMLImageElement | null>(null);

  const base = useMemo(() => imageBase(member.image), [member.image]);
  const full = useMemo(() => memberFullImage(member), [member]);
  const fallbacks = useMemo(() => memberImageFallbacks(member), [member]);

  useEffect(() => {
    return register({
      id: `member-${member.name}`,
      src: asset(full),
      alt: member.name,
      fallback: asset(member.webp === false ? member.image : `${base}-1024.webp`),
    });
  }, [register, member.name, full, member.image, base, member.webp]);

  // A cached image can finish loading before hydration attaches onLoad/
  // onError — settle the skeleton from img state on mount instead of
  // relying on the events alone, or the shimmer sticks forever.
  useEffect(() => {
    const img = photoRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setSrcIndex((index) => index + 1);
  }, []);

  const initialSrc = member.webp === false ? member.image : `${base}-640.webp`;
  const currentSrc = asset(
    srcIndex < 0 ? initialSrc : (fallbacks[srcIndex] ?? initialsPlaceholder(member.name))
  );

  return (
    <div
      className={cn('team-member', 'member-card', flipped && 'is-flipped')}
      role="button"
      tabIndex={0}
      aria-label={`Flip card for ${member.name}`}
      aria-expanded={flipped}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setFlipped((f) => !f);
        }
      }}
    >
      <div className="member-card-inner">
        <div className="member-card-face member-card-front">
          <picture
            className={cn('skeleton-wrap', loaded ? 'loaded' : 'skeleton')}
            onClick={(event) => event.stopPropagation()}
          >
            {member.webp !== false ? (
              <source
                type="image/webp"
                srcSet={`${asset(`${base}-640.webp`)} 640w, ${asset(`${base}-1024.webp`)} 1024w`}
                sizes="(max-width:600px) 100vw, 220px"
              />
            ) : (
              <source
                type={member.image.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'}
                srcSet={asset(member.image)}
              />
            )}
            <img
              ref={photoRef}
              className="member-card-photo lightbox-target"
              src={currentSrc}
              alt={member.name}
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setSrcIndex((index) => index + 1)}
              onClick={(event) => {
                event.stopPropagation();
                openLightbox({ src: asset(full), alt: member.name });
              }}
            />
          </picture>
          <div className="member-card-front-body">
            <h4>{member.name}</h4>
            <div className="member-position">{member.position}</div>
            <div className="member-card-hint">
              <RotateCw aria-hidden="true" />
              Click to reveal
            </div>
          </div>
        </div>
        <div className="member-card-face member-card-back">
          <h4>{member.name}</h4>
          <div className="member-card-meta">
            <div className="member-card-detail">
              <span>Class</span>
              <strong>{member.class || 'Unknown'}</strong>
            </div>
            <div className="member-card-detail">
              <span>Weapon</span>
              <strong>{member.weapon || 'Unknown'}</strong>
            </div>
            {member.quote ? <div className="member-card-quote">{`"${member.quote}"`}</div> : null}
          </div>
          <Link
            href={`/members/${memberSlug(member)}`}
            className="member-profile-link"
            onClick={(event) => event.stopPropagation()}
          >
            View full profile
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
