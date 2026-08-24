import {
  BookOpen,
  Feather,
  Footprints,
  GraduationCap,
  Hourglass,
  MessagesSquare,
  ShieldCheck,
  Sprout,
  Crosshair,
  TrendingUp,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';

const HALL_OF_FAME_CARDS = [
  {
    title: 'Hall of Fame',
    description: 'The number of times a guild member completes a 69-second BA.',
  },
  {
    title: 'Hall of Shame',
    description: 'The number of times a guild member completes a 67-second BA.',
  },
] as const;

const GUILD_BENEFITS: readonly { label: string; icon: LucideIcon }[] = [
  { label: 'Casual Runs', icon: Footprints },
  { label: 'Tactical Strategy', icon: Crosshair },
  { label: 'Player Mentoring', icon: GraduationCap },
  { label: 'Approachable Officers/Members', icon: MessagesSquare },
  { label: 'Stress-free Environment', icon: Feather },
  { label: 'Skill Development', icon: TrendingUp },
  { label: 'Guild Growth', icon: Sprout },
  { label: 'PvX Guide', icon: BookOpen },
  { label: 'Play at your own pace', icon: Hourglass },
  { label: 'No Pressure', icon: Wind },
  { label: 'Honor & Respect', icon: ShieldCheck },
  { label: 'Friendship First', icon: Users },
];

/** Guild Hall of Fame cards + Guild Benefits grid. */
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
              <h3>{card.title}</h3>
              <p>{card.description}</p>
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
          {GUILD_BENEFITS.map(({ label, icon: Icon }) => (
            <div className="capability-item" key={label}>
              <Icon aria-hidden="true" />
              <h4>{label}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
