import type { Metadata } from 'next';

import { BackToTop } from '@/components/back-to-top';
import { SiteHeader } from '@/components/site-header';
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
    number: '01',
    title: 'Respect Everyone',
    body: `Treat every member with respect. Friendly banter and jokes are welcome, but harassment, bullying, discrimination, personal attacks, and deliberately making others uncomfortable are not.

We want Adobo to be a place where everyone feels welcome.`,
  },
  {
    number: '02',
    title: 'No Unnecessary Drama',
    body: `Leave the drama outside the guild.

Misunderstandings happen, and not everyone will always get along. If you have a problem with another member, handle it maturely or ask an officer for help. Do not create public arguments, spread rumors, or turn personal issues into guild problems.`,
  },
  {
    number: '03',
    title: 'Play Your Way, Respect Others',
    body: `We're a casual and stress-free guild. There are no expectations to play every day or keep up with everyone else's progress.

Play at your own pace, but don't shame others for being more casual, more active, stronger, weaker, experienced, or new to the game.

Everyone enjoys the game differently.`,
  },
  {
    number: '04',
    title: "Have Fun, But Don't Ruin It for Others",
    body: `We love joking around, laughing when we lose, and laughing even harder when we win.

Have fun and be chaotic when the moment calls for it, but know the difference between harmless fun and behavior that ruins someone else's experience.`,
  },
  {
    number: '05',
    title: 'No Toxicity During Guild Activities',
    body: `Whether we win or lose, keep it respectful.

Don't blame, insult, or single out members for mistakes. We can always improve, learn, and try again. Losing is part of the game, and nobody should be afraid to join an activity because they're worried about being flamed.`,
  },
  {
    number: '06',
    title: 'Help When You Can',
    body: `You don't have to be an expert or carry everyone.

If you can help a fellow Adobo member with content, answer a question, or share useful information, we encourage you to do so. A good guild grows because its members support each other.`,
  },
  {
    number: '07',
    title: "Don't Take Advantage of Others",
    body: `Be fair when dealing with guild members.

Scamming, intentionally misleading others, exploiting members, or taking advantage of someone's trust will not be tolerated. Respect the time, effort, and generosity of others.`,
  },
  {
    number: '08',
    title: 'Keep Guild Spaces Comfortable',
    body: `Please use common sense in guild chat, Discord, and other community spaces.

Avoid excessive spam, disruptive behavior, inappropriate content, or anything that makes the community uncomfortable. Friendly conversations are encouraged, just remember that this is a shared space.`,
  },
  {
    number: '09',
    title: 'Communicate and Be Considerate',
    body: `You don't have to be active 24/7, but communication goes a long way.

If you've signed up for an activity or committed to something, try your best to show up. If something comes up, let the group know when possible. Respect other people's time just as you would want yours respected.`,
  },
  {
    number: '10',
    title: 'Listen to the Leadership Team',
    body: `Guild leaders and officers are here to help maintain a healthy community, not to control how you play the game.

If an issue requires intervention, please respect their decisions. You can always raise concerns respectfully, but repeated disregard for guild rules or leadership decisions may result in disciplinary action.`,
  },
  {
    number: '11',
    title: 'One Guild, One Community',
    body: `At the end of the day, we're here to enjoy the game together.

You don't need to be the strongest player. You don't need to be the most active. You don't need to win every fight.

Just be respectful, have fun, and don't make the game worse for the people around you.`,
  },
];

const ENFORCEMENT_STEPS = ['Reminder', 'Warning', 'Temporary Restriction', 'Removal'];

export default function RulesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" style={{ paddingTop: '6rem' }}>
        <section className="rules-page">
          <div className="container rules-container">
            <h1 className="section-title rules-title">Guild Rules</h1>
            <p className="rules-intro">
              Adobo was built to be a safe haven for players who want to enjoy{' '}
              <strong>Where Winds Meet</strong> without unnecessary pressure, toxicity, or drama. We
              play at our own pace, we play to have fun, and while we may not always win, we make
              sure we enjoy the journey together.
            </p>
            <p className="rules-intro">
              To keep our community welcoming and enjoyable for everyone, we ask all members to
              follow these rules.
            </p>

            <div className="rules-list">
              {RULES.map((rule) => (
                <article className="rule-card" key={rule.number}>
                  <span className="rule-number" aria-hidden="true">
                    {rule.number}
                  </span>
                  <div className="rule-content">
                    <h2>{rule.title}</h2>
                    {rule.body.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="rules-enforcement">
              <h2>Rule Enforcement</h2>
              <p>
                We believe in handling issues fairly and reasonably. Depending on the situation,
                violations may result in:
              </p>
              <div className="enforcement-steps">
                {ENFORCEMENT_STEPS.map((step, i) => (
                  <span key={step} className="enforcement-step">
                    <span className="step-text">{step}</span>
                    {i < ENFORCEMENT_STEPS.length - 1 && (
                      <span className="step-arrow" aria-hidden="true">
                        &rarr;
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <p className="enforcement-note">
                Serious offenses may result in immediate removal from the guild without prior
                warning.
              </p>
              <p className="enforcement-note">
                We don&apos;t enjoy enforcing rules, but protecting the community and the people in
                it will always come first.
              </p>
            </div>

            <div className="rules-closing">
              <h2>The Adobo Rule</h2>
              <p className="closing-bold">
                Don&apos;t be toxic. Don&apos;t bring unnecessary drama. Don&apos;t ruin the fun.
              </p>
              <p>
                We&apos;re here to play at our own pace, laugh at our losses, laugh harder at our
                wins, and create good memories together.
              </p>
              <p className="closing-welcome">
                Welcome to Adobo. Play your way. Have fun. Respect each other.
              </p>
            </div>
          </div>
        </section>
      </main>
      <BackToTop />
      <style>{`
        .rules-container {
          max-width: 760px;
          margin: 0 auto;
        }
        .rules-title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1.5rem;
        }
        .rules-intro {
          color: var(--muted);
          line-height: 1.75;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .rules-intro strong {
          color: var(--text);
        }

        /* Rule cards */
        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .rule-card {
          display: flex;
          align-items: flex-start;
          gap: 1.1rem;
          padding: 1.4rem 1.5rem;
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
          width: 40px;
          height: 40px;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-strong);
          background: rgb(var(--crimson-rgb) / 0.08);
          border: 1px solid rgb(var(--crimson-rgb) / 0.25);
          border-radius: 50%;
        }
        .rule-content {
          flex: 1;
          min-width: 0;
        }
        .rule-content h2 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }
        .rule-content p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--muted);
        }
        .rule-content p + p {
          margin-top: 0.5rem;
        }

        /* Enforcement section */
        .rules-enforcement {
          margin-top: 3rem;
          padding: 1.75rem;
          background: var(--wash);
          border: 1px solid var(--border-soft);
          border-radius: 4px;
        }
        .rules-enforcement h2 {
          margin: 0 0 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
        }
        .rules-enforcement > p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--muted);
        }
        .enforcement-steps {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 1rem 0;
        }
        .enforcement-step {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .step-text {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-strong);
          background: rgb(var(--crimson-rgb) / 0.08);
          border: 1px solid rgb(var(--crimson-rgb) / 0.25);
          border-radius: 4px;
        }
        .step-arrow {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .enforcement-note {
          margin-top: 0.75rem;
          font-size: 0.82rem;
          line-height: 1.65;
          color: var(--muted);
        }
        .enforcement-note:first-of-type {
          margin-top: 1rem;
        }

        /* Closing / Adobo Rule */
        .rules-closing {
          margin-top: 2.5rem;
          padding: 2rem;
          text-align: center;
          background: var(--wash);
          border: 1px solid var(--border-soft);
          border-radius: 4px;
        }
        .rules-closing h2 {
          margin: 0 0 1rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text);
        }
        .rules-closing p {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--muted);
        }
        .closing-bold {
          font-size: 1rem !important;
          font-weight: 600;
          color: var(--text) !important;
          margin-bottom: 0.75rem !important;
        }
        .closing-welcome {
          margin-top: 1rem !important;
          font-style: italic;
          color: var(--accent-strong) !important;
        }

        @media (max-width: 768px) {
          .rule-card {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1.25rem;
          }
          .rule-number {
            width: 34px;
            height: 34px;
            font-size: 0.9rem;
          }
          .enforcement-steps {
            gap: 0.35rem;
          }
          .rules-closing {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
