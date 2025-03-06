"use client";

import dynamic from "next/dynamic";
import { NavigationBar } from "@/components/NavigationBar";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState, useEffect } from "react";

const LandingReveal = dynamic(() => import("../components/LandingReveal"), {
  ssr: false,
});

export default function Home() {
  const [isRevealComplete, setIsRevealComplete] = useState(false);
  const [showComponents, setShowComponents] = useState(false);

  // Add delayed rendering of other components for smoother performance
  useEffect(() => {
    if (isRevealComplete) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowComponents(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isRevealComplete]);

  return (
    <>
      <LandingReveal onRevealComplete={() => setIsRevealComplete(true)} />
      {showComponents && (
        <>
          <NavigationBar />
          <FeaturesSection />
          <PricingSection />
        </>
      )}
    </>
  );
}
