import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  GUILD_MEMBERS,
  imageBase,
  memberBySlug,
  memberFullImage,
  memberNeighbors,
  memberSlug,
} from '@/lib/members';
import { asset } from '@/lib/site';

interface MemberPageProps {
  params: Promise<{ slug: string }>;
}

/** Portrait source chain (mirrors the roster card's responsive WebP variants). */
function portraitSrcSet(member: (typeof GUILD_MEMBERS)[number]): string | undefined {
  if (member.webp === false) return undefined;
  const base = imageBase(member.image);
  return `${asset(`${base}-640.webp`)} 640w, ${asset(`${base}-1024.webp`)} 1024w`;
}

/** Small round thumb for prev/next navigation links. */
function portraitThumb(member: (typeof GUILD_MEMBERS)[number]): string {
  return asset(member.webp === false ? member.image : `${imageBase(member.image)}-320.webp`);
}

export function generateStaticParams() {
  return GUILD_MEMBERS.map((member) => ({ slug: memberSlug(member) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = memberBySlug(slug);
  if (!member) return {};

  const title = `${member.name} — Adobo Guild`;
  const description = `${member.position} · ${member.class}${
    member.quote ? ` — "${member.quote}"` : ''
  }`;

  return {
    title,
    description,
    // Unprefixed on purpose — metadataBase joins these with the site URL.
    openGraph: {
      title,
      description,
      images: [{ url: memberFullImage(member) }],
    },
  };
}

function badgeTier(member: (typeof GUILD_MEMBERS)[number]): 'leader' | 'core' | '' {
  if (member.founder || member.position === 'Guild Master') return 'leader';
  if (member.position === 'Vice Master' || member.position === 'Officer') return 'core';
  return '';
}

/** Deep-linkable member profile — statically generated for every roster entry. */
export default async function MemberProfilePage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = memberBySlug(slug);
  if (!member) notFound();

  const { prev, next } = memberNeighbors(member);
  const tier = badgeTier(member);
  const srcSet = portraitSrcSet(member);
  const fallbackSrc = member.webp === false ? member.image : `${imageBase(member.image)}-640.webp`;

  return (
    <main id="main" className="profile-main">
      <div className="container">
        <Link href="/" className="profile-back">
          ← Back to the Guild
        </Link>

        <article className="profile-card">
          <div className="profile-photo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
            <img
              src={asset(fallbackSrc)}
              srcSet={srcSet}
              alt={member.name}
              width={640}
              height={640}
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <div className="profile-info">
            <span className={tier ? `profile-badge ${tier}` : 'profile-badge'}>
              {member.position}
            </span>
            <h1>{member.name}</h1>

            <dl className="profile-meta">
              <div>
                <dt>Class</dt>
                <dd>{member.class || 'Unknown'}</dd>
              </div>
              <div>
                <dt>Weapon</dt>
                <dd>{member.weapon || 'Unknown'}</dd>
              </div>
            </dl>

            {member.quote ? (
              <blockquote className="profile-quote">&ldquo;{member.quote}&rdquo;</blockquote>
            ) : null}

            <nav className="profile-nav" aria-label="Member navigation">
              {prev ? (
                <Link href={`/members/${memberSlug(prev)}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
                  <img src={portraitThumb(prev)} alt="" width={36} height={36} loading="lazy" />
                  <span>&larr; {prev.name}</span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {next ? (
                <Link href={`/members/${memberSlug(next)}`}>
                  <span>{next.name} &rarr;</span>
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
                  <img src={portraitThumb(next)} alt="" width={36} height={36} loading="lazy" />
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
            </nav>
          </div>
        </article>
      </div>
    </main>
  );
}
