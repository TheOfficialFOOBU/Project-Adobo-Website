import type { Metadata } from 'next';

import { SITE_TITLE, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Guild Rules — ${SITE_TITLE}`,
  description:
    'Code of conduct for Adobo Guild members in Where Winds Meet. Respect, chill vibes, and no drama.',
  alternates: {
    canonical: `${SITE_URL}/rules`,
  },
  openGraph: {
    title: `Guild Rules — ${SITE_TITLE}`,
    description:
      'Code of conduct for Adobo Guild members in Where Winds Meet. Respect, chill vibes, and no drama.',
    url: `${SITE_URL}/rules`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Guild Rules — ${SITE_TITLE}`,
    description:
      'Code of conduct for Adobo Guild members in Where Winds Meet. Respect, chill vibes, and no drama.',
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

/**
 * Guild Rules page — the seal and title sit as a compact header at the
 * top of the content area (no big masthead, no padded card, no
 * hairline rules). The mango-leaf sits above as a small flourish.
 * The intro and rules continue from the header in normal flow.
 */
export default function RulesPage() {
  return (
    <>
      <main id="main">
        <section className="rules-page">
          <div className="container rules-container">
            {/* Compact header: 規 seal inline with the title, subtitle
                below. No big masthead, no padded box. */}
            <header className="rules-header">
              {/* Mango-leaf ink accent — experimental. Positioned
                  absolutely to the LEFT of the header so it never enters
                  the layout flow and can never overlap the seal/title. */}
              <svg
                className="rules-leaf"
                viewBox="0 0 40 40"
                width="42"
                height="42"
                aria-hidden="true"
                focusable="false"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z"
                    transform="rotate(-3 20 20)"
                  />
                  <path d="M 21 37 L 21 38.5" strokeWidth="1.25" />
                  <path
                    d="M 21 36 C 20 28, 19 19, 21 11"
                    strokeWidth="0.75"
                    strokeOpacity="0.55"
                    transform="rotate(-3 20 20)"
                  />
                </g>
              </svg>

              <span className="rules-seal seal-press" aria-hidden="true">
                規
              </span>
              <h1 className="rules-title">Guild Rules</h1>
              <p className="rules-subtitle">Eleven precepts for wandering Adobo together</p>
            </header>

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

            <ol className="rules-list">
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
            </ol>

            <section className="rules-enforcement">
              <header className="rules-enforcement-head">
                <span className="rules-masthead-rule" aria-hidden="true" />
                <h2>Rule Enforcement</h2>
                <span className="rules-masthead-rule" aria-hidden="true" />
              </header>
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
            </section>

            <section className="rules-closing">
              <span className="closing-seal seal-press" aria-hidden="true">
                戒
              </span>
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
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
