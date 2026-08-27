import type { Metadata } from 'next';

import { BackToTop } from '@/components/back-to-top';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Guild Rules — ${SITE_TITLE}`,
  description:
    'Code of conduct for Adobo Guild members in Where Winds Meet. Respect, chill vibes, and no drama.',
  openGraph: {
    title: `Guild Rules — ${SITE_TITLE}`,
    description:
      'Code of conduct for Adobo Guild members in Where Winds Meet. Respect, chill vibes, and no drama.',
    type: 'website',
  },
};

const RULES = [
  {
    number: 1,
    title: 'Respect Everyone',
    description:
      'Treat guildmates, allies, and strangers with kindness. No toxicity, no harassment, no ego trips.',
  },
  {
    number: 2,
    title: 'Real Life Comes First',
    description:
      'No attendance sheets, no mandatory events. If life gets busy, the guild will be here when you get back.',
  },
  {
    number: 3,
    title: 'Keep It Chill',
    description:
      'This is a casual guild. Wipes are stories, not failures. Laugh it off and try again.',
  },
  {
    number: 4,
    title: 'No Drama',
    description:
      'If there is a conflict, talk it out privately or bring it to an officer. Do not bring it to public channels.',
  },
  {
    number: 5,
    title: 'Represent the Guild',
    description:
      'When you wear the tag, you represent all of us. Be kind in world chat, PvP, and everywhere else.',
  },
  {
    number: 6,
    title: 'Communicate',
    description:
      'If you cannot make a run or need help, just say so. No one will judge you — we would rather know than guess.',
  },
  {
    number: 7,
    title: 'Have Fun',
    description:
      'That is the whole point. If you are not having fun, something is wrong — let us know and we will fix it.',
  },
];

export default function RulesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" style={{ paddingTop: '6rem' }}>
        <section className="rules-page">
          <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h1
              className="section-title"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}
            >
              Guild Rules
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                fontSize: '0.95rem',
              }}
            >
              These rules keep Adobo Guild the chill, fun community we all signed up for. They are
              short on purpose — if you can remember these seven, you are golden.
            </p>
            <div className="rules-list">
              {RULES.map((rule) => (
                <div className="rule-card" key={rule.number}>
                  <span className="rule-number" aria-hidden="true">
                    {rule.number}
                  </span>
                  <div>
                    <h2>{rule.title}</h2>
                    <p>{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                color: 'var(--muted)',
                marginTop: '2.5rem',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                borderTop: '1px solid var(--border-softer)',
                paddingTop: '1.5rem',
              }}
            >
              Questions? Reach out to any officer or ask in the Discord. We are all on the same
              team.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <BackToTop />
      <style>{`
        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .rule-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: var(--wash);
          border: 1px solid var(--border-soft);
          border-radius: 4px;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .rule-card:hover {
          border-color: rgb(var(--accent-rgb) / 0.45);
          transform: translateY(-1px);
        }
        .rule-number {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent-strong);
          background: rgb(var(--crimson-rgb) / 0.08);
          border: 1px solid rgb(var(--crimson-rgb) / 0.25);
          border-radius: 50%;
        }
        .rule-card h2 {
          margin: 0 0 0.3rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }
        .rule-card p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.65;
          color: var(--muted);
        }
      `}</style>
    </>
  );
}
