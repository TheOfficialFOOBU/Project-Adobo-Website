'use client';

import { ArrowRight, Link2, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Highlight } from '@/components/highlight';
import { MemberDiscordStatus } from '@/components/member-discord-status';
import { MemberPersonalSeal } from '@/components/member-personal-seal';
import { useLightbox } from '@/components/lightbox-provider';
import {
  imageBase,
  initialsPlaceholder,
  memberBadgeTier,
  memberDisplayTitle,
  memberFullImage,
  memberImageFallbacks,
  memberSlug,
  memberTier,
  memberTierLabel,
  type GuildMember,
} from '@/lib/members';
import { asset, BASE_PATH } from '@/lib/site';
import { cn } from '@/lib/utils';

interface MemberRowProps {
  member: GuildMember;
  /** Active roster search term — matching substrings render in <mark>. */
  highlight?: string;
  /** When true, the photo sits on the right side. Founders/core get the
   *  default (left) placement; long lists alternate for visual rhythm. */
  reverse?: boolean;
}

/**
 * "Scroll of Members" row — a horizontal, always-readable layout that
 * replaces the previous 3D flip card. Photo on one side, name + meta +
 * quote on the other. No interaction required to read the quote.
 *
 * Hover lifts the photo slightly and brightens the corner brackets;
 * the entire row is keyboard-focusable and acts as a single profile link.
 */
export function MemberRow({ member, highlight = '', reverse = false }: MemberRowProps) {
  const { register, openLightbox } = useLightbox();
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
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

  const tier = memberTier(member);
  const badgeTier = memberBadgeTier(member);
  const tierLabel = memberTierLabel(member);

  const rowClass = cn(
    'member-row',
    reverse && 'member-row--reverse',
    tier === 'leader' && 'member-row--founder',
    tier === 'core' && 'member-row--core',
    tier === 'member' && 'member-row--member'
  );

  return (
    <article className={rowClass} id={`member-${memberSlug(member)}`}>
      <div className="member-row-portrait">
        <span className="member-row-bracket member-row-bracket--tl" aria-hidden="true" />
        <span className="member-row-bracket member-row-bracket--br" aria-hidden="true" />
        <picture
          className={cn('skeleton-wrap', loaded ? 'loaded' : 'skeleton')}
          onClick={(event) => event.stopPropagation()}
        >
          {member.webp !== false ? (
            <source
              type="image/webp"
              srcSet={`${asset(`${base}-640.webp`)} 640w, ${asset(`${base}-1024.webp`)} 1024w`}
              sizes="(max-width:768px) 100vw, 320px"
            />
          ) : (
            <source
              type={member.image.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'}
              srcSet={asset(member.image)}
            />
          )}
          <img
            ref={photoRef}
            className="member-row-photo lightbox-target"
            src={currentSrc}
            alt={member.name}
            width={480}
            height={480}
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
        <span className={`member-row-seal member-row-seal--${badgeTier}`} aria-hidden="true">
          {tierLabel}
        </span>
        <span className="member-row-chop" aria-hidden="true">
          <MemberPersonalSeal name={member.name} size={64} />
        </span>
      </div>

      <div className="member-row-content">
        <div className="member-row-head">
          <h3>
            <Highlight text={member.name} query={highlight} />
            {member.discordId ? (
              <MemberDiscordStatus discordId={member.discordId} variant="dot" />
            ) : null}
          </h3>
          <span className="member-row-position">
            <Highlight text={memberDisplayTitle(member)} query={highlight} />
          </span>
        </div>

        <dl className="member-row-meta">
          <div>
            <dt>Class</dt>
            <dd>
              <Highlight text={member.class || 'Unknown'} query={highlight} />
            </dd>
          </div>
          <div>
            <dt>Weapon</dt>
            <dd>
              <Highlight text={member.weapon || 'Unknown'} query={highlight} />
            </dd>
          </div>
        </dl>

        {member.quote ? (
          <blockquote className="member-row-quote">
            <span className="member-row-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            {member.quote}
            <span className="member-row-quote-mark member-row-quote-mark--end" aria-hidden="true">
              &rdquo;
            </span>
          </blockquote>
        ) : null}

        <div className="member-row-actions">
          <Link
            href={`/members/${memberSlug(member)}`}
            className="member-row-profile-link"
            aria-label={`View ${member.name}'s full profile`}
          >
            View profile
            <ArrowRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="member-row-copy"
            onClick={(event) => {
              event.stopPropagation();
              const url = `${window.location.origin}${BASE_PATH}/members/${memberSlug(member)}`;
              if (typeof navigator.share === 'function') {
                navigator
                  .share({ url })
                  .then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => {});
                return;
              }
              if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(url).then(
                  () => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  },
                  () => {}
                );
              }
            }}
            aria-label={copied ? 'Link copied' : `Copy link to ${member.name}'s profile`}
          >
            {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </article>
  );
}
