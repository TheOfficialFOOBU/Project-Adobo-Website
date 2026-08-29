import {
  BookOpen,
  Crown,
  Feather,
  Footprints,
  GraduationCap,
  Hourglass,
  MessagesSquare,
  ShieldCheck,
  Sprout,
  Crosshair,
  Trophy,
  TrendingUp,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';

import { CountUp } from '@/components/count-up';

const HALL_OF_FAME_CARDS = [
  {
    title: 'Hall of Fame',
    stat: 12,
    description: 'The number of times a guild member completes a 69-second BA.',
  },
  {
    title: 'Hall of Shame',
    stat: 27,
    description: 'The number of times a guild member completes a 67-second BA.',
  },
] as const;

/** Curated guild milestones — manually maintained by officers. */
const GUILD_HIGHLIGHTS: readonly { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Crown,
    title: 'Guild Founding',
    description:
      'Born from a 5-member squad, Adobo Guild grew into a 20+ strong community united by good vibes.',
  },
  {
    icon: Trophy,
    title: 'First Guild Picture',
    description:
      'Our first official photo as a full guild, the moment we stopped being a group and became a family.',
  },
  {
    icon: ShieldCheck,
    title: 'GvG Ready',
    description:
      'Built a roster that can hold its own in Guild vs Guild, tactical enough to win, chaotic enough to have fun.',
  },
  {
    icon: Users,
    title: '60+ Members',
    description: 'Crossed the 60-member mark, no waitlist, openly recruiting, no requirements.',
  },
];

const GUILD_BENEFITS: readonly { label: string; icon: LucideIcon; description: string }[] = [
  {
    label: 'Casual Runs',
    icon: Footprints,
    description: 'Relaxed boss runs where fun comes first and wipes are just stories.',
  },
  {
    label: 'Tactical Strategy',
    icon: Crosshair,
    description: 'Plan fights together, then laugh together when the plan falls apart.',
  },
  {
    label: 'Player Mentoring',
    icon: GraduationCap,
    description: 'Veterans happily walk newer players through builds, bosses, and basics.',
  },
  {
    label: 'Approachable Members',
    icon: MessagesSquare,
    description: 'Questions are always welcome; nobody here bites.',
  },
  {
    label: 'Stress-free Environment',
    icon: Feather,
    description: 'No yelling, no blame games, no drama. Just good vibes.',
  },
  {
    label: 'Skill Development',
    icon: TrendingUp,
    description: 'Improve at your own pace with tips, sparring, and shared setups.',
  },
  {
    label: 'Guild Growth',
    icon: Sprout,
    description: 'We invest in every member so the whole guild levels up together.',
  },
  {
    label: 'PvX Guide',
    icon: BookOpen,
    description: 'Community-built guides covering PvE, PvP, and everything between.',
  },
  {
    label: 'Play at your own pace',
    icon: Hourglass,
    description: 'Daily grinder or weekend wanderer, both are equally at home.',
  },
  {
    label: 'No Pressure',
    icon: Wind,
    description: 'Real life comes first. No attendance sheets, ever.',
  },
  {
    label: 'Honor & Respect',
    icon: ShieldCheck,
    description: 'Treat everyone well in and out of the guild. Non-negotiable.',
  },
  {
    label: 'Friendship First',
    icon: Users,
    description: 'The game is just the campfire; the people around it are the point.',
  },
];

/** Guild Hall of Fame cards + Highlights + Guild Benefits grid. */
export function GuildBenefitsSection() {
  return (
    <section className="capabilities" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Hall of Fame
          <span className="section-number" aria-hidden="true">
            序
          </span>
        </h2>
        <div className="guild-hall-grid">
          {HALL_OF_FAME_CARDS.map((card) => (
            <div className="guild-stat-card" key={card.title}>
              <CountUp value={card.stat} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        <div className="guild-highlights">
          {GUILD_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div className="guild-highlight-card" key={title}>
              <Icon aria-hidden="true" className="guild-highlight-icon" />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <h2 className="section-title">
          Guild Benefits
          <span className="section-number" aria-hidden="true">
            貳
          </span>
        </h2>
        <div className="capabilities-grid">
          {GUILD_BENEFITS.map(({ label, icon: Icon, description }) => (
            <div className="capability-item" key={label}>
              <Icon aria-hidden="true" />
              <h3>{label}</h3>
              <div className="capability-desc">
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
