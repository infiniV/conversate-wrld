"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const LandingReveal = dynamic(() => import("../components/LandingReveal"), {
  ssr: false,
});

const NavigationBar = dynamic(
  () => import("../components/NavigationBar").then((mod) => mod.NavigationBar),
  { ssr: false }
);

const FeaturesSection = dynamic(
  () =>
    import("../components/FeaturesSection").then((mod) => mod.FeaturesSection),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const PricingSection = dynamic(
  () =>
    import("../components/PricingSection").then((mod) => mod.PricingSection),
  { ssr: false }
);

// Add the new ContactSection component
const ContactSection = dynamic(
  () =>
    import("../components/ContactSection").then((mod) => mod.ContactSection),
  { ssr: false }
);

export default function Home() {
  const [contentMounted, setContentMounted] = useState(false);

  const handleRevealComplete = useCallback(() => {
    setTimeout(() => setContentMounted(true), 100);
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <LandingReveal onRevealComplete={handleRevealComplete} />

      <AnimatePresence mode="wait">
        {contentMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <NavigationBar />
            <Suspense fallback={<div className="min-h-screen" />}>
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <FeaturesSection />
                <PricingSection />
                <ContactSection />
              </motion.div>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
