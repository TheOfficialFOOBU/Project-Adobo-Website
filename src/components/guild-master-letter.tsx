import { signature } from '@/data/gm-letter';

interface GuildMasterLetterProps {
  /** Optional override for `signature.name` (e.g. for unit tests). */
  authorName?: string;
}

/**
 * "A Letter from the Guild Master" — editorial block built from real
 * data only. If no letter is configured in src/data/gm-letter.ts, the
 * component renders nothing rather than invent content. FOOBU's letter
 * is intentionally not invented; officers can populate the field when
 * a real message exists.
 */
export function GuildMasterLetter({ authorName }: GuildMasterLetterProps) {
  if (!signature.body || signature.body.trim().length === 0) return null;
  const displayAuthor = authorName ?? signature.name;

  return (
    <section className="gm-letter" aria-labelledby="gm-letter-title">
      <div className="container">
        <article className="gm-letter-dossier">
          <header className="gm-letter-head">
            <span className="gm-letter-label">A Letter from the Guild Master</span>
            <h2 id="gm-letter-title" className="gm-letter-title">
              {signature.headline}
            </h2>
            <p className="gm-letter-meta">
              <span>{displayAuthor}</span>
              {signature.signedOn ? <span> · {signature.signedOn}</span> : null}
            </p>
          </header>
          <div className="gm-letter-body">
            {signature.body.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <footer className="gm-letter-foot">
            <span className="gm-letter-signature">— {displayAuthor}</span>
          </footer>
        </article>
      </div>
    </section>
  );
}
