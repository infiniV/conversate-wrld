"use client";

import { NavigationBar } from "@/components/NavigationBar";
import { LandingHero } from "@/components/LandingHero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";

export default function Home() {
  return (
    <main>
      <NavigationBar />
      <LandingHero />
      <FeaturesSection />
      <PricingSection />
    </main>
  );
}
