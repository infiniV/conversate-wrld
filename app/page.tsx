"use client";

import { NavigationBar } from "@/components/NavigationBar";
import { LandingHero } from "@/components/LandingHero";
import { FeaturesSection } from "@/components/FeaturesSection";

export default function Home() {
  return (
    <>
      <NavigationBar />
      <LandingHero />
      <FeaturesSection />
    </>
  );
}
