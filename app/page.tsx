"use client";

import { LandingHero } from "@/components/LandingHero";
import { OrbFeatureShowcase } from "@/components/OrbFeatureShowcase";
import { NavigationBar } from "../components/NavigationBar";

export default function Home() {
  return (
    <>
      <NavigationBar />
      <LandingHero />
      <OrbFeatureShowcase />
    </>
  );
}
