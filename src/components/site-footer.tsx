import { DiscordWidget } from '@/components/discord-widget';
import { BASE_PATH, DISCORD_INVITE } from '@/lib/site';

// Footer link order mirrors the homepage section flow.
//
// Guild column = the guild's own story (Home, Activities, Videos, Members,
// Philosophy) — the order a visitor encounters on the homepage.
// Where Winds Meet column = the game's records and governance (Hall of
// Records, Rules, FAQ, Contact). All hrefs are real: the homepage
// anchors exist and /rules is a real route.
const GUILD_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Activities' },
  { href: '#videos', label: 'Videos' },
  { href: '#team', label: 'Members' },
  { href: '#philosophy', label: 'Philosophy' },
] as const;

const WWM_LINKS = [
  { href: '#hall-of-records', label: 'Hall of Records' },
  { href: `${BASE_PATH}/rules`, label: 'Rules' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
] as const;

/** Site footer — community card, link columns. */
export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Community</h3>
            <div className="discord-widget" id="discord-widget">
              <DiscordWidget />
              <small className="discord-widget-note">Adobo Where Winds Meet Discord</small>
            </div>
          </div>
          <nav className="footer-section" aria-label="Guild navigation">
            <h3>Guild</h3>
            {GUILD_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <nav className="footer-section" aria-label="Where Winds Meet navigation">
            <h3>Where Winds Meet</h3>
            {WWM_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              Join our Discord
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </nav>
        </div>

        {/* Final seal — large ADOBO mark with corner ticks, centered between
            hairline rules. Closes the page the same way the hero opens it.
            Paired with the mango-leaf on the left and a Baybayin ᜊ (Ba)
            glyph on the right — the Filipino-script cultural mark that
            closes the page. Both are stroke-only, low opacity, decorative. */}
        <div className="footer-seal">
          <svg
            className="footer-leaf"
            viewBox="0 0 40 40"
            width="36"
            height="36"
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
          <span className="footer-seal-rule" aria-hidden="true" />
          <span className="footer-seal-mark">ADOBO</span>
          <span className="footer-seal-rule" aria-hidden="true" />
          <svg
            className="footer-ba"
            viewBox="0 0 40 40"
            width="36"
            height="36"
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
              {/* Baybayin ᜊ (Ba) — hand-tuned artistic interpretation.
                  Three parts: a curved main stroke (the body of the
                  letter), a small dot (piloc) at the upper-left, and a
                  small cross/kudlit at the upper-right. Stroke-only, no
                  fill, matches the mango-leaf's line-art treatment. */}
              <path d="M 13 13 C 13 10, 17 9, 21 11 C 25 13, 24 19, 20 23 C 16 27, 14 29, 14 32" />
              <circle cx="11" cy="12" r="1.4" fill="currentColor" stroke="none" />
              <line x1="27" y1="12" x2="30" y2="9" />
              <line x1="30" y1="12" x2="27" y2="9" />
            </g>
          </svg>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} ADOBO GUILD — Where Winds Meet</span>
            <span className="footer-flavor" aria-label="Guild motto">
              Made with sinigang, Discord energy, and zero toxicity.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
