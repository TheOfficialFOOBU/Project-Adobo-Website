import { ContactLeaderDialog } from '@/components/contact-leader-dialog';
import { CopyButton } from '@/components/copy-button';
import { DISCORD_INVITE } from '@/lib/site';

/** Final call-to-action section (“Contact”). */
export function ContactCtaSection() {
  return (
    <section className="hero-2 contact-cta" id="contact">
      <div className="hero-2-content centered">
        <h2>
          Ready to Become
          <br />a part of our Journey?
        </h2>
        <p>
          Whether your idea is joining our casual guild, building lasting friendships, or creating
          legendary moments we&apos;re here to welcome you.
        </p>
        <div className="hero-cta-row">
          <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="cta-button">
            Join Discord
          </a>
          <CopyButton value={DISCORD_INVITE} label="Copy invite" className="copy-invite-button" />
          <ContactLeaderDialog />
        </div>
      </div>
    </section>
  );
}
