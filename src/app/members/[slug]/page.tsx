import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GUILD_MEMBERS, imageBase, memberBySlug, memberNeighbors, memberSlug } from '@/lib/members';
import { CopyProfileLink } from '@/components/copy-profile-link';
import { DiscordPresence } from '@/components/discord-presence';
import { ProfileStickyBar } from '@/components/profile-sticky-bar';
import { ProfileCloseButton } from '@/components/profile-close-button';
import { asset, SITE_URL } from '@/lib/site';

interface MemberPageProps {
  params: Promise<{ slug: string }>;
}

/** Portrait source chain (mirrors the roster row's responsive WebP variants). */
function portraitSrcSet(member: (typeof GUILD_MEMBERS)[number]): string | undefined {
  if (member.webp === false) return undefined;
  const base = imageBase(member.image);
  return `${asset(`${base}-640.webp`)} 640w, ${asset(`${base}-1024.webp`)} 1024w, ${asset(`${base}-1600.webp`)} 1600w`;
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
  const ogImage = `/images/og/members/${memberSlug(member)}.jpg`;
  const profileUrl = `${SITE_URL}/members/${memberSlug(member)}`;

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title,
      description,
      url: profileUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${member.name} — Adobo Guild` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

function badgeTier(member: (typeof GUILD_MEMBERS)[number]): 'leader' | 'core' | '' {
  if (member.founder || member.position === 'Guild Master') return 'leader';
  if (member.position === 'Vice Master' || member.position === 'Officer') return 'core';
  return '';
}

/** Deep-linkable member profile — full-width portrait hero, centered dossier,
 *  floating prev/next chevrons. Statically generated for every roster entry. */
export default async function MemberProfilePage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = memberBySlug(slug);
  if (!member) notFound();

  const { prev, next } = memberNeighbors(member);
  const tier = badgeTier(member);
  const srcSet = portraitSrcSet(member);
  const fallbackSrc = member.webp === false ? member.image : `${imageBase(member.image)}-1024.webp`;
  const heroSrc = member.webp === false ? member.image : `${imageBase(member.image)}-1600.webp`;
  const prevLink = prev ? { name: prev.name, href: `/members/${memberSlug(prev)}` } : null;
  const nextLink = next ? { name: next.name, href: `/members/${memberSlug(next)}` } : null;

  return (
    <main id="main" className="profile-main">
      {/* Preload the hero portrait — LCP element on this page. */}
      <link rel="preload" as="image" href={asset(heroSrc)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: member.name,
            url: `${SITE_URL}/members/${memberSlug(member)}`,
            image: `${SITE_URL}${fallbackSrc}`,
            jobTitle: member.position,
            description: member.quote ? `"${member.quote}"` : undefined,
            memberOf: {
              '@type': 'Organization',
              name: 'Adobo Guild',
              url: SITE_URL,
            },
          }),
        }}
      />

      {/* ---------- Full-width portrait hero ---------- */}
      <div className="profile-hero">
        <picture className="profile-hero-picture">
          {member.webp !== false ? (
            <source
              type="image/webp"
              srcSet={`${asset(`${imageBase(member.image)}-1024.webp`)} 1024w, ${asset(
                `${imageBase(member.image)}-1600.webp`
              )} 1600w`}
              sizes="100vw"
            />
          ) : null}
          <img
            src={asset(heroSrc)}
            srcSet={srcSet}
            alt={member.name}
            className="profile-hero-img"
            width={1600}
            height={1600}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="profile-hero-scrim" aria-hidden="true" />
        <div className="profile-hero-overlay">
          <Link href="/" className="profile-back">
            &larr; Back to the Guild
          </Link>
          <div className="profile-hero-text">
            <span className={`profile-badge profile-badge--hero ${tier}`}>{member.position}</span>
            <h1>{member.name}</h1>
            <p className="profile-hero-sub">{member.class || 'Unknown'}</p>
          </div>
        </div>
      </div>

      {/* ---------- Centered dossier ---------- */}
      <ProfileStickyBar
        name={member.name}
        position={member.position}
        thumb={portraitThumb(member)}
        prev={prevLink}
        next={nextLink}
      >
        <article className="profile-dossier">
          <ProfileCloseButton />

          {/* Quote pulled out as a full-width panel — the most important
              piece of personality on the page. */}
          {member.quote ? (
            <blockquote className="profile-quote">
              <span className="profile-quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              {member.quote}
              <span className="profile-quote-mark profile-quote-mark--end" aria-hidden="true">
                &rdquo;
              </span>
            </blockquote>
          ) : null}

          {/* Meta dossier */}
          <section className="profile-meta">
            <div className="profile-meta-item">
              <span className="profile-meta-label">Class</span>
              <span className="profile-meta-value">{member.class || 'Unknown'}</span>
            </div>
            <div className="profile-meta-item">
              <span className="profile-meta-label">Weapon</span>
              <span className="profile-meta-value">{member.weapon || 'Unknown'}</span>
            </div>
            <div className="profile-meta-item">
              <span className="profile-meta-label">Position</span>
              <span className="profile-meta-value">{member.position}</span>
            </div>
            <div className="profile-meta-item">
              <span className="profile-meta-label">Tier</span>
              <span className="profile-meta-value">
                {member.founder
                  ? 'Founder'
                  : member.position === 'Vice Master' || member.position === 'Officer'
                    ? 'Core'
                    : 'Member'}
              </span>
            </div>
          </section>

          {/* Discord presence + profile link */}
          <div className="profile-actions">
            <CopyProfileLink url={`${SITE_URL}/members/${memberSlug(member)}`} />
            {member.discordId ? <DiscordPresence discordId={member.discordId} /> : null}
          </div>

          {/* Floating prev/next chevrons */}
          <nav className="profile-nav profile-nav--floating" aria-label="Member navigation">
            {prev ? (
              <Link
                href={`/members/${memberSlug(prev)}`}
                className="profile-nav-arrow profile-nav-arrow--prev"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
                <img
                  src={portraitThumb(prev)}
                  alt={prev.name}
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <span>
                  <span className="profile-nav-arrow-label">Previous</span>
                  <span className="profile-nav-arrow-name">{prev.name}</span>
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next ? (
              <Link
                href={`/members/${memberSlug(next)}`}
                className="profile-nav-arrow profile-nav-arrow--next"
              >
                <span>
                  <span className="profile-nav-arrow-label">Next</span>
                  <span className="profile-nav-arrow-name">{next.name}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated WebP assets */}
                <img
                  src={portraitThumb(next)}
                  alt={next.name}
                  width={48}
                  height={48}
                  loading="lazy"
                />
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        </article>
      </ProfileStickyBar>
    </main>
  );
}
