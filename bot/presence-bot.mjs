#!/usr/bin/env node
/**
 * Live Discord presence relay.
 *
 * Connects to the Discord gateway, keeps an in-memory snapshot of the
 * guild's online members, and exposes a single HTTP endpoint, `GET
 * /presence`. The site's hero badge calls this from the browser via
 * `NEXT_PUBLIC_DISCORD_PRESENCE_URL`.
 *
 * Required env vars:
 *   DISCORD_BOT_TOKEN                bot token from the Developer Portal
 *   DISCORD_GUILD_ID                 numeric guild ID to watch
 *   DISCORD_PRESENCE_PORT            port to listen on (default 8787)
 *   DISCORD_PRESENCE_ALLOWED_ORIGIN  CORS allow-list origin (e.g. your
 *                                     Vercel deployment URL). REQUIRED in
 *                                     production so the endpoint isn't
 *                                     open to every origin on the web.
 *   DISCORD_PRESENCE_SECRET          Optional. If set, the X-Presence-Secret
 *                                     header must match. Use this if you
 *                                     later route the request through a
 *                                     server-side proxy.
 */
import { createServer } from 'node:http';
import { Client, GatewayIntentBits, Events } from 'discord.js';

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const PORT = Number.parseInt(process.env.DISCORD_PRESENCE_PORT ?? '8787', 10);
const SECRET = process.env.DISCORD_PRESENCE_SECRET ?? null;
const ALLOWED_ORIGIN = process.env.DISCORD_PRESENCE_ALLOWED_ORIGIN ?? null;

function fail(message) {
  console.error(`[presence-bot] ${message}`);
  process.exit(1);
}

if (!TOKEN) fail('DISCORD_BOT_TOKEN is not set.');
if (!GUILD_ID) fail('DISCORD_GUILD_ID is not set.');
if (!ALLOWED_ORIGIN) {
  console.warn(
    '[presence-bot] WARNING: DISCORD_PRESENCE_ALLOWED_ORIGIN is not set; ' +
      'CORS will allow every origin. Set it in production.'
  );
}

/** In-memory presence snapshot. { userId: { username, avatar, status } } */
const members = new Map();
let lastAsOf = null;

function snapshot() {
  const list = [...members.values()];
  const avatars = list
    .map((m) => m.avatar)
    .filter((url) => typeof url === 'string' && url.length > 0)
    .slice(0, 6);
  return {
    online: list.length,
    memberCount: list.length,
    avatars,
    asOf: lastAsOf,
    source: 'gateway',
  };
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`[presence-bot] logged in as ${c.user.tag}`);
  const guild = c.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error(`[presence-bot] bot is not in guild ${GUILD_ID}`);
    return;
  }
  // Initial scan.
  guild.members
    .fetch({ withPresences: true })
    .then((collection) => {
      members.clear();
      for (const m of collection.values()) {
        if (m.presence && m.presence.status !== 'offline') {
          members.set(m.id, {
            username: m.user.username,
            avatar: m.user.displayAvatarURL({ size: 64 }),
            status: m.presence.status,
          });
        }
      }
      lastAsOf = new Date().toISOString();
      console.log(`[presence-bot] initial online: ${members.size}`);
    })
    .catch((err) => {
      console.error('[presence-bot] initial fetch failed:', err);
    });
});

client.on(Events.PresenceUpdate, (oldPresence, newPresence) => {
  const member = newPresence.member;
  if (!member || member.guild.id !== GUILD_ID) return;
  const id = member.id;
  const status = newPresence.status;
  if (status === 'offline') {
    members.delete(id);
  } else {
    members.set(id, {
      username: member.user.username,
      avatar: member.user.displayAvatarURL({ size: 64 }),
      status,
    });
  }
  lastAsOf = new Date().toISOString();
});

client.on(Events.Error, (err) => {
  console.error('[presence-bot] discord client error:', err);
});

client.login(TOKEN).catch((err) => {
  fail(`discord login failed: ${err.message}`);
});

/* ---------- HTTP ---------- */

function corsHeaders() {
  const h = {
    'content-type': 'application/json',
    'cache-control': 'no-store',
  };
  if (ALLOWED_ORIGIN) h['access-control-allow-origin'] = ALLOWED_ORIGIN;
  return h;
}

const server = createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405, corsHeaders());
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  if (req.url === '/healthz') {
    res.writeHead(200, corsHeaders());
    res.end(JSON.stringify({ ok: true, uptime: process.uptime() }));
    return;
  }

  if (req.url === '/presence') {
    if (SECRET) {
      const provided = req.headers['x-presence-secret'];
      if (typeof provided !== 'string' || provided !== SECRET) {
        res.writeHead(401, corsHeaders());
        res.end(JSON.stringify({ error: 'unauthorized' }));
        return;
      }
    }
    res.writeHead(200, corsHeaders());
    res.end(JSON.stringify(snapshot()));
    return;
  }

  res.writeHead(404, corsHeaders());
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, () => {
  console.log(`[presence-bot] listening on :${PORT}`);
});

function shutdown() {
  console.log('[presence-bot] shutting down');
  server.close();
  client.destroy();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
