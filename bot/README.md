# Discord live-presence bot

Small standalone Node service that:

1. Connects to the Discord gateway via [discord.js](https://discord.js.org/) v14.
2. Maintains an in-memory set of currently-online members for one guild
   (presence status of `online` / `idle` / `dnd`).
3. Exposes a single HTTP endpoint, `GET /presence`, returning the snapshot
   as JSON.

It is **not** part of the Next.js app. Run it on Railway / Fly / Render /
a small VPS. The Next.js site polls it directly from the browser via
`NEXT_PUBLIC_DISCORD_PRESENCE_URL`.

## Required env vars (set in the host, never in code)

| Var                               | Purpose                                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DISCORD_BOT_TOKEN`               | Bot token from the Discord Developer Portal. **Reset it if it ever leaks.**                                                                      |
| `DISCORD_GUILD_ID`                | The numeric guild ID the bot watches.                                                                                                            |
| `DISCORD_PRESENCE_PORT`           | Port the bot's HTTP server listens on (default `8787`).                                                                                          |
| `DISCORD_PRESENCE_ALLOWED_ORIGIN` | CORS allow-list origin (e.g. `https://project-adobo-website.vercel.app`). **Required in production** so the endpoint isn't open to every origin. |
| `DISCORD_PRESENCE_SECRET`         | Optional. If set, the `X-Presence-Secret` header must match. Skip unless you front this with a server-side proxy.                                |

## Endpoints

- `GET /healthz` → `200 "ok"`. No auth.
- `GET /presence` → JSON. CORS-restricted to the allow-list origin.

## Vercel env var (site side)

In your Vercel project, set:

| Var                                | Value                                                       |
| ---------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_DISCORD_PRESENCE_URL` | The bot's public URL, e.g. `https://adobo-presence.fly.dev` |

Then redeploy. The hero badge will start polling the live endpoint on
the next page load.

## Response shape

```json
{
  "online": 7,
  "memberCount": 7,
  "avatars": ["https://cdn.discordapp.com/avatars/.../...png"],
  "asOf": "2026-08-31T12:00:00.000Z",
  "source": "gateway"
}
```

## Local dev

```
npm install
DISCORD_BOT_TOKEN=... DISCORD_GUILD_ID=1454979473681285334 \
  DISCORD_PRESENCE_ALLOWED_ORIGIN=http://localhost:3000 \
  node bot/presence-bot.mjs
```

### Optional: keep the token in a `.env.local` file

If you'd rather not pass the token through PowerShell every time (and have
it survive shell restarts), copy `bot/.env.local.example` to
`bot/.env.local`, drop the token in, and run the launcher:

```
DISCORD_BOT_TOKEN=...  # fill the rest of the values in bot/.env.local
node bot/start-bot.mjs
```

`bot/.env.local` is gitignored. The launcher reads it once on start and
forwards everything to `presence-bot.mjs`.

> Tip for local-only testing: set
> `DISCORD_PRESENCE_ALLOWED_ORIGIN=http://localhost:8080` so the preview
> server (the one `npm run preview` exposes) can hit `/presence` without
> CORS errors. Use a comma-separated origin if you also need to allow the
> production site during local QA.
