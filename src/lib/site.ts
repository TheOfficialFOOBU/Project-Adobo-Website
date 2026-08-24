/**
 * Prefix every URL in a srcset string ("url 1600w, url 1024w, ...") with the
 * base path.
 */
export function assetSrcSet(srcSet: string): string {
  return srcSet
    .split(',')
    .map((candidate) => {
      const [url, ...descriptors] = candidate.trim().split(' ');
      return [asset(url), ...descriptors].join(' ');
    })
    .join(', ');
}

/** Canonical site URL and shared metadata strings. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://foobu.github.io/Project-Adobo-Website';

export const SITE_TITLE = 'Adobo Guild - Where Winds Meet';

/** Single source of truth — update here if the invite ever resets. */
export const DISCORD_INVITE = 'https://discord.gg/NdZXkmYJnS';

export const SITE_DESCRIPTION =
  'Adobo Guild — peace-first, fun-obsessed community in Where Winds Meet. Relax, make friends, and enjoy the game together.';

/** Repository sub-path for GitHub Pages (e.g. "/Project-Adobo-Website"). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefix a public/ asset URL so it resolves under the GitHub Pages base path.
 * Absolute URLs, data/blob URIs and already-prefixed paths pass through
 * untouched.
 */
export function asset(path: string): string {
  const external = /^(https?:|data:|blob:)/i.test(path);
  const alreadyPrefixed = BASE_PATH !== '' && path.startsWith(`${BASE_PATH}/`);
  if (external || alreadyPrefixed || !path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
