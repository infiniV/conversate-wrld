"use client";

import dynamic from "next/dynamic";
import { NavigationBar } from "@/components/NavigationBar";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState } from "react";

const LandingReveal = dynamic(() => import("../components/LandingReveal"), {
  ssr: false,
});

export default function Home() {
  const [isRevealComplete, setIsRevealComplete] = useState(false);

  return (
    <>
      <LandingReveal onRevealComplete={() => setIsRevealComplete(true)} />
      {isRevealComplete && (
        <>
          <NavigationBar />
          <FeaturesSection />
          <PricingSection />
        </>
      )}
    </>
  );
}
