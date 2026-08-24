import { asset } from '@/lib/site';

/**
 * Discord guild widget access. The widget.json endpoint is public whenever
 * the server has its widget enabled (same requirement as the footer iframe)
 * and returns presence data we surface as live stats.
 *
 * Fetches are build-safe: any failure (offline build, rate limit, blocked
 * network) resolves to null and callers render nothing.
 */
export const DISCORD_GUILD_ID = '1454979473681285334';

export const DISCORD_WIDGET_JSON_URL = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;

export interface DiscordPresence {
  /** Members currently online. */
  online: number;
  /** Total known members reported by the widget, when present. */
  memberCount: number | null;
  /** Up to six avatar URLs of who's online right now. */
  avatars: string[];
}

interface WidgetJson {
  name?: string;
  instant_invite?: string;
  presence_count?: number;
  members?: { username?: string; avatar_url?: string }[];
}

export function discordIcon(): string {
  return asset('/images/icons/discord.svg');
}

/** Build-time fetch of the widget payload; never throws. */
export async function fetchDiscordPresence(): Promise<DiscordPresence | null> {
  try {
    const response = await fetch(DISCORD_WIDGET_JSON_URL, {
      signal: AbortSignal.timeout(8000),
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      console.error(`[discord] widget.json responded ${response.status}`);
      return null;
    }
    const data = (await response.json()) as WidgetJson;
    const avatars = (data.members ?? [])
      .map((member) => member.avatar_url)
      .filter((url): url is string => typeof url === 'string')
      .slice(0, 6);
    return {
      online: typeof data.presence_count === 'number' ? data.presence_count : 0,
      memberCount: Array.isArray(data.members) ? data.members.length : null,
      avatars,
    };
  } catch (err) {
    console.error(
      '[discord] widget fetch failed:',
      err instanceof Error ? `${err.name}: ${err.message}` : err
    );
    return null;
  }
}
