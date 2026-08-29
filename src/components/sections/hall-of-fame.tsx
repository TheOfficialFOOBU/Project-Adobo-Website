import { CountUp } from '@/components/count-up';

/** Per-record entry — a member's name and how many times they hold it. */
interface RecordEntry {
  /** Member name as it appears on the roster. */
  name: string;
  /** Number of times they set / fell short of the record. */
  count: number;
}

const HALL_OF_FAME_CARDS: {
  title: string;
  seal: string;
  description: string;
  entries: readonly RecordEntry[];
}[] = [
  {
    title: 'Hall of Fame',
    seal: '名',
    description: 'The number of times a guild member completes a 69-second BA.',
    entries: [{ name: 'FOOBU', count: 12 }],
  },
  {
    title: 'Hall of Shame',
    seal: '辱',
    description: 'The number of times a guild member completes a 67-second BA.',
    entries: [{ name: 'Calialy', count: 27 }],
  },
];

/**
 * Hall of Records — community milestones with named record-holders. The
 * section was promoted out of Guild Benefits so the numbers (and the
 * members behind them) get proper weight.
 */
export function HallOfFameSection() {
  return (
    <section className="hall-of-fame" id="hall-of-records" data-animate>
      <div className="container">
        <h2 className="section-title">
          Hall of Records
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
            <article className="hof-stat-card" key={card.title}>
              <span className="hof-stat-seal" aria-hidden="true">
                {card.seal}
              </span>
              <h3 className="hof-stat-card-title">{card.title}</h3>
              <p className="hof-stat-card-description">{card.description}</p>
              <ul className="hof-record-list">
                {card.entries.map((entry) => (
                  <li className="hof-record-entry" key={entry.name}>
                    <span className="hof-record-name">{entry.name}</span>
                    <span className="hof-record-divider" aria-hidden="true" />
                    <span className="hof-record-count">
                      <CountUp value={entry.count} />
                      <span className="hof-record-count-suffix" aria-hidden="true">
                        ×
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
