'use client';

import { useState } from 'react';

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
 * "Guild FAQ" — a two-column numbered index + answer panel.
 * Left column is a numbered index of questions (Cormorant display
 * cinnabar numerals + Cormorant italic questions). Right column shows
 * the selected answer. On mobile, the index stacks above the answer.
 *
 * Single-open behavior: clicking a question in the index selects it
 * and shows its answer in the panel; clicking the active question
 * deselects it.
 */
export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="faq" id="faq" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild FAQ
          <span className="section-number seal-press" aria-hidden="true">
            伍
          </span>
        </h2>
        <div className="faq-layout">
          <ol className="faq-index">
            {FAQS.map((item, i) => {
              const isActive = activeIndex === i;
              return (
                <li key={item.question}>
                  <button
                    type="button"
                    className={`faq-index-item${isActive ? ' faq-index-item--active' : ''}`}
                    onClick={() => setActiveIndex((prev) => (prev === i ? null : i))}
                    aria-expanded={isActive}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="faq-index-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq-index-q">{item.question}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div
            className="faq-panel"
            id={`faq-panel-${activeIndex ?? 0}`}
            role="region"
            aria-live="polite"
          >
            {activeIndex !== null ? (
              <>
                <p className="faq-panel-question">{FAQS[activeIndex].question}</p>
                <p className="faq-panel-answer">{FAQS[activeIndex].answer}</p>
              </>
            ) : (
              <p className="faq-panel-placeholder">Select a question to read its answer.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
