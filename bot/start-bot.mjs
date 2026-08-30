#!/usr/bin/env node
/**
 * Tiny launcher for the presence bot that sources env vars from
 * `bot/.env.local` (if present) before delegating to `presence-bot.mjs`.
 *
 * Why: setting env vars through PowerShell only persists for the current
 * shell. If you close the terminal that started the bot, the bot dies with
 * no record of the token anywhere on disk. Drop your token into `bot/.env.local`
 * once (gitignored) and this script will load it every time:
 *
 *   bot/.env.local
 *     DISCORD_BOT_TOKEN=...
 *     DISCORD_GUILD_ID=1454979473681285334
 *     DISCORD_PRESENCE_PORT=8787
 *     # CORS allow-list (comma-separated). For local dev include both
 *     # your production origin and http://localhost:8080 (preview server):
 *     DISCORD_PRESENCE_ALLOWED_ORIGIN=http://localhost:8080
 *
 * Usage:
 *   node bot/start-bot.mjs
 *   # or, with overrides on the command line:
 *   DISCORD_BOT_TOKEN=xxx node bot/start-bot.mjs
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(HERE, '.env.local');

if (existsSync(ENV_FILE)) {
  for (const raw of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const child = spawn(process.execPath, [join(HERE, 'presence-bot.mjs')], {
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
