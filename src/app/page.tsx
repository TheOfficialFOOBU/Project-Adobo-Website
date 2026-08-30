import { LightboxProvider } from '@/components/lightbox-provider';
import { ActivitiesSection } from '@/components/sections/activities';
import { ContactCtaSection } from '@/components/sections/contact-cta';
import { FaqSection } from '@/components/sections/faq';
import { GuildBenefitsSection } from '@/components/sections/guild-benefits';
import { HallOfFameSection } from '@/components/sections/hall-of-fame';
import { HeroSection } from '@/components/sections/hero';
import { PhilosophySection } from '@/components/sections/philosophy';
import { RosterSection } from '@/components/sections/roster';
import { VideoGallerySection } from '@/components/sections/video-gallery';
import { WhatWeDoSection, WarriorLedSection } from '@/components/sections/intro-splits';
import { GuildMasterLetter } from '@/components/guild-master-letter';
import { fetchDiscordPresence } from '@/lib/discord';

export default async function HomePage() {
  // Fetch Discord presence once at the page level so the hero can use
  // it for its live presence badge. If the widget is blocked, the hero
  // gracefully omits the badge.
  const presence = await fetchDiscordPresence();
  return (
    <LightboxProvider>
      <main id="main">
        <HeroSection initialPresence={presence} />
        <WarriorLedSection />
        <WhatWeDoSection />
        <ActivitiesSection />
        <VideoGallerySection />
        <HallOfFameSection />
        <GuildBenefitsSection />
        <PhilosophySection />
        <RosterSection />
        <FaqSection />
        <GuildMasterLetter />
        <ContactCtaSection />
      </main>
    </LightboxProvider>
  );
}
