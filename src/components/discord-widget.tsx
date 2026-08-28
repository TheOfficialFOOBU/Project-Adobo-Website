'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { DISCORD_GUILD_ID, discordIcon } from '@/lib/discord';
import { DISCORD_INVITE } from '@/lib/site';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Matches the inline script's dark default so hydration never mismatches. */
function getServerSnapshot(): 'dark' | 'light' {
  return 'dark';
}

const LOAD_TIMEOUT_MS = 8000;

/**
 * Discord server widget (online count + join button). The embed follows the
 * site theme via the theme query param. The iframe mounts only after the
 * visitor opts in: Discord's CDN answers avatar requests with a third-party
 * `__cf_bm` cookie, which tanks the Lighthouse best-practices score on a
 * passive page load. Ad blockers and some networks block the widget outright
 * too — if the iframe hasn't reported a load within the timeout we swap in a
 * themed static card so the footer never shows a hole.
 */
export function DiscordWidget() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || loaded) return;
    const timer = setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [enabled, loaded]);

  if (!enabled) {
    return (
      <div className="discord-fallback">
        {/* eslint-disable-next-line @next/next/no-img-element -- original SVG icon asset */}
        <img src={discordIcon()} className="discord-fallback-icon" alt="" />
        <p>Adobo Where Winds Meet Discord</p>
        <button type="button" onClick={() => setEnabled(true)} className="cta-button small">
          Show online members
        </button>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="discord-fallback">
        {/* eslint-disable-next-line @next/next/no-img-element -- original SVG icon asset */}
        <img src={discordIcon()} className="discord-fallback-icon" alt="" />
        <p>Adobo Where Winds Meet Discord</p>
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button small"
        >
          Join us on Discord
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={`https://discord.com/widget?id=${DISCORD_GUILD_ID}&theme=${theme}`}
      className={loaded ? 'discord-iframe loaded' : 'discord-iframe'}
      width="350"
      height="440"
      title="Adobo Guild Discord — online members"
      loading="lazy"
      referrerPolicy="no-referrer"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      onLoad={() => setLoaded(true)}
    />
  );
}
