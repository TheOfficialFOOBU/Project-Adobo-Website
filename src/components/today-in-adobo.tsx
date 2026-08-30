import { Sparkles } from 'lucide-react';

import activitiesData from '@/data/activities.json';
import videosData from '@/data/videos.json';
import type { DiscordPresence } from '@/lib/discord';
import { GUILD_MEMBERS } from '@/lib/members';

interface TodayInAdoboProps {
  presence: DiscordPresence | null;
}

/**
 * "Today in Adobo" — a small living noticeboard that surfaces real data
 * only. Every fact here is read from an existing source: Discord widget
 * presence, the member roster, the activities feed, or the videos archive.
 * Nothing is fabricated.
 *
 * The module renders nothing when no real data exists — it gracefully
 * disappears rather than display fake facts.
 */
interface ActivityRecord {
  id: string;
  title: string;
  description: string;
  type?: string;
}

function getActivityRecords(): ActivityRecord[] {
  return activitiesData as ActivityRecord[];
}

export function TodayInAdobo({ presence }: TodayInAdoboProps) {
  const recentActivity = getActivityRecords()[0];
  const recentVideo = (videosData as { title: string; id: string }[])[0];
  const quoteOfTheDay = pickQuoteOfTheDay();

  const hasContent =
    Boolean(presence) || Boolean(recentActivity) || Boolean(recentVideo) || Boolean(quoteOfTheDay);

  if (!hasContent) return null;

  return (
    <section className="today-in-adobo" aria-labelledby="today-in-adobo-title">
      <div className="container">
        <header className="today-in-adobo-head">
          <span className="today-in-adobo-mark" aria-hidden="true">
            <Sparkles />
          </span>
          <h3 id="today-in-adobo-title" className="today-in-adobo-title">
            Today in Adobo
          </h3>
          <p className="today-in-adobo-lede">A small living noticeboard from the guild.</p>
        </header>

        <div className="today-in-adobo-grid">
          {presence ? <OnlineCard presence={presence} /> : null}
          {recentActivity ? <LatestActivityCard activity={recentActivity} /> : null}
          {recentVideo ? <LatestVideoCard video={recentVideo} /> : null}
          {quoteOfTheDay ? <QuoteCard quote={quoteOfTheDay} /> : null}
        </div>
      </div>
    </section>
  );
}

function OnlineCard({ presence }: { presence: DiscordPresence }) {
  return (
    <article className="today-card today-card--online">
      <span className="today-card-label">Currently online</span>
      <strong className="today-card-figure">
        {presence.online}
        <span aria-hidden="true" className="today-card-dot" />
      </strong>
      <p className="today-card-meta">
        {presence.online === 1 ? 'wanderer' : 'wanderers'} in the Discord right now
      </p>
    </article>
  );
}

interface ActivityRecord {
  id: string;
  title: string;
  description: string;
  type?: string;
}

function LatestActivityCard({ activity }: { activity: ActivityRecord }) {
  return (
    <article className="today-card today-card--activity">
      <span className="today-card-label">Latest chronicle</span>
      <h4 className="today-card-title">{activity.title}</h4>
      {activity.type ? <span className="today-card-meta">{activity.type}</span> : null}
      <p className="today-card-body">{activity.description}</p>
    </article>
  );
}

function LatestVideoCard({ video }: { video: { id: string; title: string } }) {
  return (
    <article className="today-card today-card--video">
      <span className="today-card-label">From the chronicles</span>
      <h4 className="today-card-title">{video.title}</h4>
      <p className="today-card-meta">A moment worth replaying.</p>
    </article>
  );
}

function QuoteCard({ quote }: { quote: { name: string; text: string } }) {
  return (
    <article className="today-card today-card--quote">
      <span className="today-card-label">A wanderer, today</span>
      <blockquote className="today-card-quote">
        <span aria-hidden="true">&ldquo;</span>
        {quote.text}
        <span aria-hidden="true">&rdquo;</span>
      </blockquote>
      <span className="today-card-meta">— {quote.name}</span>
    </article>
  );
}

/**
 * Deterministic per-day quote of the day: rotate through the members
 * who actually have a quote, indexed by day-of-year. Same quote all day,
 * different quote tomorrow.
 */
function pickQuoteOfTheDay(): { name: string; text: string } | null {
  const quoters = GUILD_MEMBERS.filter((m) => m.quote && m.quote.trim().length > 0);
  if (quoters.length === 0) return null;
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = now.getTime() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const pick = quoters[dayOfYear % quoters.length];
  return { name: pick.name, text: pick.quote as string };
}
