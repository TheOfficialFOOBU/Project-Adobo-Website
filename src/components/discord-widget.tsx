'use client';

import { useSyncExternalStore } from 'react';

const WIDGET_ID = '1454979473681285334';

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

/**
 * Discord server widget (online count + join button).
 * The embed follows the site theme: Discord restyles the iframe via the
 * theme query param, so we swap it whenever <html data-theme> flips
 * (same store pattern as components/theme-toggle).
 */
export function DiscordWidget() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <iframe
      src={`https://discord.com/widget?id=${WIDGET_ID}&theme=${theme}`}
      className="discord-iframe"
      width="350"
      height="440"
      title="Adobo Guild Discord — online members"
      loading="lazy"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    />
  );
}
