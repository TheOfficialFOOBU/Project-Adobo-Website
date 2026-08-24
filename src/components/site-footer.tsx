import { asset } from '@/lib/site';

const GUILD_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Achievements' },
  { href: '#team', label: 'Members' },
  { href: '#philosophy', label: 'Philosophy' },
] as const;

// Anchors resolve to real sections only (the original #about/#recruit/#faq
// pointed at content that never existed).
const WWM_LINKS = [
  { href: '#contact', label: 'Contact' },
  { href: '#philosophy', label: 'About' },
] as const;

// Only links that actually resolve somewhere real. Re-add Twitter/Instagram/
// YouTube rows here (with real URLs) once those profiles exist.
const BOTTOM_SOCIALS = [
  {
    href: 'https://discord.gg/NdZXkmYJnS',
    title: 'Discord',
    icon: '/images/icons/discord.svg',
    alt: 'Discord',
    labeled: true,
  },
] as const;

/** Site footer — community card, link columns, social row. */
export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h5>Community</h5>
            <div className="discord-widget" id="discord-widget">
              <div
                className="discord-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'center',
                }}
              >
                <a
                  href="https://discord.gg/NdZXkmYJnS"
                  target="_blank"
                  rel="noopener"
                  aria-label="Open Discord invite"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- original SVG icon assets */}
                  <img
                    src={asset('/images/icons/discord.svg')}
                    className="social-icon"
                    alt="Discord"
                  />
                </a>
              </div>
              <small className="discord-widget-note">Adobo Where Winds Meet Discord</small>
            </div>
          </div>
          <div className="footer-section">
            <h5>Guild</h5>
            {GUILD_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="footer-section">
            <h5>Social</h5>
            <a href="https://discord.gg/NdZXkmYJnS" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </div>
          <div className="footer-section">
            <h5>Where Winds Meet</h5>
            {WWM_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} ADOBO GUILD — Where Winds Meet • Powered by FOOBU</div>
          <div className="social-links">
            {BOTTOM_SOCIALS.map((social) => (
              <a
                href={social.href}
                title={social.title}
                aria-label={social.labeled ? social.title : undefined}
                target="_blank"
                rel="noopener noreferrer"
                key={social.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- original SVG icon assets */}
                <img src={asset(social.icon)} className="social-icon" alt={social.alt} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
