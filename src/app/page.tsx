import { LightboxProvider } from '@/components/lightbox-provider';
import { ActivitiesSection } from '@/components/sections/activities';
import { ContactCtaSection } from '@/components/sections/contact-cta';
import { FaqSection } from '@/components/sections/faq';
import { GuildBenefitsSection } from '@/components/sections/guild-benefits';
import { HeroSection } from '@/components/sections/hero';
import { PhilosophySection } from '@/components/sections/philosophy';
import { RosterSection } from '@/components/sections/roster';
import { WhatWeDoSection, WarriorLedSection } from '@/components/sections/intro-splits';

export default function HomePage() {
  return (
    <LightboxProvider>
      <main id="main">
        <HeroSection />
        <WarriorLedSection />
        <WhatWeDoSection />
        <ActivitiesSection />
        <GuildBenefitsSection />
        <PhilosophySection />
        <RosterSection />
        <FaqSection />
        <ContactCtaSection />
      </main>
    </LightboxProvider>
  );
}
