/**
 * Guild Benefits — 3-column categorized grid with hand-drawn SVG icons.
 *
 * The Lucide icons read as stock SaaS. The new icons are hand-drawn
 * line-art SVGs that match the existing wuxia-stroke vocabulary (the
 * same style as the chapter stamp, the cinnabar seals, and the
 * mango-leaf). The grid is 3 columns labeled "Play," "Help,"
 * "Respect." Each column has 3-4 cards.
 */

type BenefitCategory = {
  id: string;
  label: string;
  cards: { label: string; description: string; iconKey: string }[];
};

const CATEGORIES: BenefitCategory[] = [
  {
    id: 'play',
    label: 'Play',
    cards: [
      {
        label: 'Casual Runs',
        description: 'Relaxed boss runs where fun comes first and wipes are just stories.',
        iconKey: 'sword',
      },
      {
        label: 'Tactical Strategy',
        description: 'Plan fights together, then laugh together when the plan falls apart.',
        iconKey: 'shield',
      },
      {
        label: 'No Pressure',
        description: 'Real life comes first. No attendance sheets, ever.',
        iconKey: 'hourglass',
      },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    cards: [
      {
        label: 'Player Mentoring',
        description: 'Veterans happily walk newer players through builds, bosses, and basics.',
        iconKey: 'mentor',
      },
      {
        label: 'Friendly Community',
        description: 'Questions are always welcome. Nobody here bites.',
        iconKey: 'chat',
      },
      {
        label: 'PvX Guide',
        description: 'Community-built guides covering PvE, PvP, and everything between.',
        iconKey: 'book',
      },
      {
        label: 'Skill Development',
        description: 'Improve at your own pace with tips, sparring, and shared setups.',
        iconKey: 'sprout',
      },
    ],
  },
  {
    id: 'respect',
    label: 'Respect',
    cards: [
      {
        label: 'Stress-free',
        description: 'No yelling, no blame games, no drama. Just good vibes.',
        iconKey: 'feather',
      },
      {
        label: 'Honor & Respect',
        description: 'Treat everyone well in and out of the guild. Non-negotiable.',
        iconKey: 'honor',
      },
      {
        label: 'Friendship First',
        description: 'The game is just the campfire; the people around it are the point.',
        iconKey: 'people',
      },
    ],
  },
];

/* Hand-drawn line-art SVG icons — 24x24 viewBox, stroke-only, no fill.
   Same vocabulary as the chapter stamp, cinnabar seals, and
   mango-leaf. Each path is simplified but reads as a recognizable
   shape. */

const ICON_PATHS: Record<string, React.ReactNode> = {
  sword: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4 L20 12" />
      <path d="M14 6 L18 10" />
      <path d="M10 14 L20 14" />
      <path d="M11 16 L19 16" />
      <path d="M14 20 L16 22" />
      <path d="M12 20 L18 20" />
    </g>
  ),
  shield: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 L20 6 L20 13 C20 17 16 20 12 21 C8 20 4 17 4 13 L4 6 Z" />
      <path d="M8 11 L11 14 L16 9" />
    </g>
  ),
  hourglass: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3 L17 3" />
      <path d="M7 21 L17 21" />
      <path d="M7 3 C7 8 17 8 17 3" />
      <path d="M7 21 C7 16 17 16 17 21" />
      <path d="M9 3 L9 5 M15 3 L15 5 M9 19 L9 21 M15 19 L15 21" />
    </g>
  ),
  mentor: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="3" />
      <path d="M6 21 C6 16 8 13 12 13 C16 13 18 16 18 21" />
      <path d="M4 12 L7 10" />
      <path d="M20 12 L17 10" />
    </g>
  ),
  chat: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5 L4 16 L8 16 L8 20 L13 16 L20 16 L20 5 Z" />
      <path d="M8 9 L16 9" />
      <path d="M8 12 L13 12" />
    </g>
  ),
  book: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5 C4 4 5 3 6 3 L11 3 L12 5 L13 3 L18 3 C19 3 20 4 20 5 L20 20 L13 18 L12 20 L11 18 L4 20 Z" />
      <path d="M12 5 L12 18" />
    </g>
  ),
  sprout: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21 L12 14" />
      <path d="M12 14 C9 14 6 12 5 9 C8 9 11 11 12 14" />
      <path d="M12 14 C15 14 18 12 19 9 C16 9 13 11 12 14" />
      <path d="M9 21 L15 21" />
    </g>
  ),
  feather: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 4 C16 5 12 8 8 12 C6 14 4 17 4 20" />
      <path d="M8 12 L12 11" />
      <path d="M10 14 L14 13" />
      <path d="M6 16 L10 15" />
      <path d="M4 20 L8 19" />
    </g>
  ),
  honor: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 L17 6 L17 12 C17 16 14 19 12 20 C10 19 7 16 7 12 L7 6 Z" />
      <path d="M12 8 L12 14" />
      <path d="M9 11 L12 14 L15 11" />
    </g>
  ),
  people: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M3 19 C3 15 5 13 8 13 C11 13 13 15 13 19" />
      <path d="M11 19 C11 15 13 13 16 13 C19 13 21 15 21 19" />
    </g>
  ),
};

function BenefitIcon({ name }: { name: string }) {
  const icon = ICON_PATHS[name] ?? ICON_PATHS['sword'];
  return (
    <svg
      className="benefit-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

export function GuildBenefitsSection() {
  return (
    <section className="capabilities guild-benefits" id="benefits" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Benefits
          <span className="section-number seal-press" aria-hidden="true">
            貳
          </span>
        </h2>
        <p className="benefits-lede">What we offer the people who walk these paths with us.</p>
        <div className="benefits-columns">
          {CATEGORIES.map((category) => (
            <div className="benefits-column" key={category.id}>
              <h3 className="benefits-column-label">{category.label}</h3>
              <ul className="benefits-list">
                {category.cards.map((card) => (
                  <li className="benefits-item" key={card.label}>
                    <BenefitIcon name={card.iconKey} />
                    <div className="benefits-item-body">
                      <h4>{card.label}</h4>
                      <p>{card.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
