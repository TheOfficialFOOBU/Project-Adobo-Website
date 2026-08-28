import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'What kind of guild is Adobo?',
    answer:
      'A casual, PvX guild in Where Winds Meet. We are peace-first and fun-obsessed: no sweaty requirements, no mandatory grind, just good people sharing the journey together.',
  },
  {
    question: 'How do I join?',
    answer:
      'Hop into our Discord, say hi, and an officer will get you sorted. No applications, no trials, no gear checks.',
  },
  {
    question: 'Are there activity requirements?',
    answer:
      "None. Real life comes first. Whether you're online every day or only occasionally, there's always a place for you here. Nobody gets kicked for playing less, unless you've been offline for more than 30 days.",
  },
  {
    question: 'Do I have to join GvG?',
    answer:
      'GvG is completely optional. We fight together for the fun of it — winning is great, losing is funny, and neither changes what we are here for.',
  },
  {
    question: "I'm a new player. Can I still join?",
    answer:
      'Absolutely. Mentoring, build advice, guides, and patient answers are all part of the guild — our veterans genuinely enjoy helping newer wanderers find their footing.',
  },
] as const;

/**
 * “Guild FAQ” — native <details>/<summary> accordion, so it works with
 * zero client-side JavaScript and stays fully accessible by default.
 */
export function FaqSection() {
  return (
    <section className="faq" id="faq" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild FAQ
          <span className="section-number" aria-hidden="true">
            伍
          </span>
        </h2>
        <div className="faq-list">
          {FAQS.map(({ question, answer }) => (
            <details className="faq-item" key={question}>
              <summary>
                {question}
                <ChevronDown aria-hidden="true" />
              </summary>
              <p className="faq-answer">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
