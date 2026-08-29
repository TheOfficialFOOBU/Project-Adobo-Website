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

const HIGHLIGHTS = [
  { count: '5→60+', label: 'Members', detail: 'From a 5-squad to a real guild.' },
  { count: '1st', label: 'Guild Pic', detail: 'The moment we became a family.' },
  { count: 'GvG', label: 'Ready', detail: 'Tactical enough to win, chaotic enough to have fun.' },
  { count: '∞', label: 'Good Vibes', detail: 'Open recruiting. No requirements. No drama.' },
] as const;

/** Dedicated "Hall of Fame" section — promoted out of Guild Benefits so the
 *  community milestones land with proper weight. */
export function HallOfFameSection() {
  return (
    <section className="hall-of-fame" id="hall-of-fame" data-animate>
      <div className="container">
        <h2 className="section-title">
          Hall of Fame
          <span className="section-number" aria-hidden="true">
            序
          </span>
        </h2>
        <p className="hall-of-fame-lede">
          The numbers that quietly define our guild. Some earned. Some, well&hellip; earned
          differently.
        </p>

        <div className="hof-stat-grid">
          {HALL_OF_FAME_CARDS.map((card) => (
            <div className="hof-stat-card" key={card.title}>
              <span className="hof-stat-seal" aria-hidden="true">
                印
              </span>
              <CountUp value={card.stat} className="hof-stat-value" />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <div className="hof-highlights">
          {HIGHLIGHTS.map((h) => (
            <div className="hof-highlight-row" key={h.label}>
              <span className="hof-highlight-count">{h.count}</span>
              <span className="hof-highlight-divider" aria-hidden="true" />
              <div className="hof-highlight-body">
                <span className="hof-highlight-label">{h.label}</span>
                <span className="hof-highlight-detail">{h.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
