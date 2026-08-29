import {
  BookOpen,
  Feather,
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

const GUILD_BENEFITS: readonly { label: string; icon: LucideIcon; description: string }[] = [
  {
    label: 'Casual Runs',
    icon: Wind,
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

/** Guild Benefits grid — wuxia-styled tiles with always-visible descriptions
 *  on touch devices and a soft corner-bracket treatment. */
export function GuildBenefitsSection() {
  return (
    <section className="capabilities guild-benefits" id="benefits" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Benefits
          <span className="section-number" aria-hidden="true">
            貳
          </span>
        </h2>
        <p className="benefits-lede">What we offer the people who walk these paths with us.</p>
        <div className="capabilities-grid">
          {GUILD_BENEFITS.map(({ label, icon: Icon, description }) => (
            <div className="capability-item" key={label}>
              <span className="capability-mark" aria-hidden="true">
                <Icon />
              </span>
              <div className="capability-body">
                <h3>{label}</h3>
                <div className="capability-desc">
                  <p>{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
