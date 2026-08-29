import { DiscordWidget } from '@/components/discord-widget';
import { DISCORD_INVITE } from '@/lib/site';

const GUILD_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Activities' },
  { href: '#team', label: 'Members' },
  { href: '#philosophy', label: 'Philosophy' },
] as const;

// Anchors resolve to real sections only (the original #about/#recruit/#faq
// pointed at content that never existed). Discord absorbs the old one-link
// Social column.
const WWM_LINKS = [
  { href: '#contact', label: 'Contact' },
  { href: '#faq', label: 'FAQ' },
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
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} ADOBO GUILD — Where Winds Meet • Powered by FOOBU</div>
        </div>
      </div>
    </footer>
  );
}
