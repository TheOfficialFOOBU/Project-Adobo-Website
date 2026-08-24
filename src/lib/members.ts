/**
 * Guild roster — data lives in src/data/members.json so non-developer
 * officers can add/edit members without touching TypeScript.
 *
 * `webp: false` marks members whose photos have no responsive WebP variants
 * (scripts/convert-images.js generates them for new photos).
 */
import rawMembers from '@/data/members.json';

export interface GuildMember {
  name: string;
  class: string;
  position: string;
  weapon: string;
  image: string;
  quote?: string;
  founder?: boolean;
  webp?: boolean;
}

export const GUILD_MEMBERS: GuildMember[] = rawMembers;

const POSITION_RANK: Record<string, number> = {
  'Guild Master': 0,
  'Vice Master': 1,
  Officer: 2,
};

/** Founders, in roster order. */
export const FOUNDERS: GuildMember[] = GUILD_MEMBERS.filter((m) => m.founder);

/**
 * Core members (leaders/officers), ranked Guild Master -> Vice Master ->
 * Officer, then alphabetically. Mirrors the original renderCoreMembers().
 */
export const CORE_MEMBERS: GuildMember[] = GUILD_MEMBERS.filter(
  (m) =>
    !m.founder && (['Vice Master', 'Officer'].includes(m.position) || m.name === 'Schalsweiser')
).sort((a, b) => {
  const rankA = POSITION_RANK[a.position] ?? 2;
  const rankB = POSITION_RANK[b.position] ?? 2;
  if (rankA !== rankB) return rankA - rankB;
  return a.name.localeCompare(b.name);
});

/** Regular members (position === "Member"), alphabetical — mirrors getCurrentMembers(). */
export const REGULAR_MEMBERS: GuildMember[] = GUILD_MEMBERS.filter(
  (m) => m.position === 'Member'
).sort((a, b) => a.name.localeCompare(b.name));

export type MemberSortKey = 'name' | 'position' | 'class' | 'weapon';

const SORT_POSITION_ORDER: Record<string, number> = {
  'Guild Leader': 1,
  'Vice Master': 2,
  Officer: 3,
  Member: 4,
};

export function sortMembers(members: GuildMember[], sortBy: MemberSortKey): GuildMember[] {
  const sorted = [...members];
  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'position':
      sorted.sort((a, b) => {
        const rankA = SORT_POSITION_ORDER[a.position] ?? Number.MAX_SAFE_INTEGER;
        const rankB = SORT_POSITION_ORDER[b.position] ?? Number.MAX_SAFE_INTEGER;
        return rankA - rankB;
      });
      break;
    case 'class':
      sorted.sort((a, b) => a.class.localeCompare(b.class));
      break;
    case 'weapon':
      sorted.sort((a, b) => a.weapon.localeCompare(b.weapon));
      break;
  }
  return sorted;
}

/** Strip the image extension to build responsive WebP variant paths. */
export function imageBase(image: string): string {
  return image.replace(/\.(jpg|jpeg|png)$/i, '');
}

/**
 * Full-resolution image used by the lightbox. The image tooling generates
 * lossless WebP at 640/1024 only, so -lossless-1024 is the highest variant
 * guaranteed to exist for every WebP member photo.
 */
export function memberFullImage(member: GuildMember): string {
  return member.webp === false ? member.image : `${imageBase(member.image)}-lossless-1024.webp`;
}

/**
 * Candidate fallback URLs tried in order when a member photo fails to load
 * (ported from the original tryAlternateSources chain, pruned to the WebP
 * variants that actually ship — the raw originals were dropped to cut ~130 MB
 * from the deploy).
 */
export function memberImageFallbacks(member: GuildMember): string[] {
  if (member.webp === false) return [];
  const base = imageBase(member.image);
  return [`${base}-480.webp`, `${base}-320.webp`];
}

/** Initials-avatar SVG placeholder shown when every fallback fails. */
export function initialsPlaceholder(name: string): string {
  const initials =
    name
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '';
  const font = encodeURIComponent('Inter, system-ui, -apple-system, Segoe UI, Roboto');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#1a1a1a'/><text x='50%' y='50%' font-family='${font}' font-size='140' fill='#e9e9e9' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ---------- Profile-page URL slugs (/members/[slug]) ---------- */

/** Kebab-case slug for a member name (ASCII-safe; CJK/symbols collapse out). */
export function slugifyMember(name: string): string {
  const cleaned = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return (
    cleaned
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'member'
  );
}

/**
 * Slug registry computed once so every member gets a unique, stable URL
 * (name collisions would otherwise map two profiles onto one route).
 */
const MEMBER_SLUGS: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  const used = new Set<string>();
  for (const member of GUILD_MEMBERS) {
    let slug = slugifyMember(member.name);
    for (let n = 2; used.has(slug); n += 1) slug = `${slugifyMember(member.name)}-${n}`;
    used.add(slug);
    map.set(member.name, slug);
  }
  return map;
})();

export function memberSlug(member: GuildMember): string {
  return MEMBER_SLUGS.get(member.name) ?? slugifyMember(member.name);
}

export function memberBySlug(slug: string): GuildMember | undefined {
  return GUILD_MEMBERS.find((member) => memberSlug(member) === slug);
}

/** Adjacent roster entries for prev/next profile navigation. */
export function memberNeighbors(member: GuildMember): { prev?: GuildMember; next?: GuildMember } {
  const index = GUILD_MEMBERS.findIndex((m) => m.name === member.name);
  if (index === -1) return {};
  return {
    prev: index > 0 ? GUILD_MEMBERS[index - 1] : undefined,
    next: index < GUILD_MEMBERS.length - 1 ? GUILD_MEMBERS[index + 1] : undefined,
  };
}
