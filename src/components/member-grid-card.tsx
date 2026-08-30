'use client';

import { ArrowRight, Link2, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MemberPersonalSeal } from '@/components/member-personal-seal';
import { MemberDiscordStatus } from '@/components/member-discord-status';
import { Highlight } from '@/components/highlight';
import { useLightbox } from '@/components/lightbox-provider';
import {
  imageBase,
  initialsPlaceholder,
  memberBadgeTier,
  memberDisplayTitle,
  memberFullImage,
  memberImageFallbacks,
  memberSlug,
  memberTierLabel,
  type GuildMember,
} from '@/lib/members';
import { asset, BASE_PATH } from '@/lib/site';
import { cn } from '@/lib/utils';

interface MemberGridCardProps {
  member: GuildMember;
  highlight?: string;
}

/**
 * Compact 3-up grid card used by the Grid view of the Scroll of Members.
 * Keeps the cinnabar seal vocabulary (corner ticks, tier seal, personal
 * chop) and uses the Cormorant display type for the member name and the
 * italic quote. Designed to feel like a portrait plate in a manuscript
 * gallery rather than a generic dashboard card.
 */
export function MemberGridCard({ member, highlight = '' }: MemberGridCardProps) {
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
      id: `member-grid-${member.name}`,
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

  const badgeTier = memberBadgeTier(member);
  const tierLabel = memberTierLabel(member);

  const copyShareLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.origin}${BASE_PATH}/members/${memberSlug(member)}`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url });
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className={cn('member-grid-card', `member-grid-card--${badgeTier}`)}>
      <Link
        href={`/members/${memberSlug(member)}`}
        className="member-grid-card-portrait-link"
        aria-label={`View ${member.name}'s full profile`}
      >
        <div className="member-grid-card-portrait">
          <span
            className="member-grid-card-bracket member-grid-card-bracket--tl"
            aria-hidden="true"
          />
          <span
            className="member-grid-card-bracket member-grid-card-bracket--br"
            aria-hidden="true"
          />
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
              className="member-grid-card-photo lightbox-target"
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
                event.preventDefault();
                openLightbox({ src: asset(full), alt: member.name });
              }}
            />
          </picture>
          <span className={`member-grid-card-seal member-grid-card-seal--${badgeTier}`}>
            {tierLabel}
          </span>
          <span className="member-grid-card-chop" aria-hidden="true">
            <MemberPersonalSeal name={member.name} size={42} />
          </span>
        </div>
      </Link>

      <div className="member-grid-card-body">
        <header className="member-grid-card-head">
          <h3>
            <Highlight text={member.name} query={highlight} />
            {member.discordId ? (
              <MemberDiscordStatus discordId={member.discordId} variant="dot" />
            ) : null}
          </h3>
          <span className="member-grid-card-position">
            <Highlight text={memberDisplayTitle(member)} query={highlight} />
          </span>
        </header>

        <dl className="member-grid-card-meta">
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
          <blockquote className="member-grid-card-quote">
            <span className="member-grid-card-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <Highlight text={member.quote} query={highlight} />
            <span
              className="member-grid-card-quote-mark member-grid-card-quote-mark--end"
              aria-hidden="true"
            >
              &rdquo;
            </span>
          </blockquote>
        ) : null}

        <div className="member-grid-card-actions">
          <Link
            href={`/members/${memberSlug(member)}`}
            className="member-grid-card-profile-link"
            aria-label={`View ${member.name}'s full profile`}
          >
            View profile
            <ArrowRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="member-grid-card-copy"
            onClick={copyShareLink}
            aria-label={copied ? 'Link copied' : `Copy link to ${member.name}'s profile`}
          >
            {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </article>
  );
}
