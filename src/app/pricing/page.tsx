"use client";

import { PricingSection } from "~/components/PricingSection";
import { motion } from "framer-motion";
import { FuturisticBackground } from "~/components/FuturisticBackground";
import { ThemeColors } from "~/components/ThemeConstants";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen">
      <FuturisticBackground />
      <div className="container relative z-10 mx-auto px-4 py-8">
        {/* Onboarding header */}
        <div className="mx-auto mb-8 max-w-4xl text-center">
          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-12 max-w-xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: ThemeColors.accent,
                    backgroundColor: ThemeColors.accent,
                  }}
                >
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Select Plan
                </span>
              </motion.div>

              <div
                className="h-[2px] w-16"
                style={{
                  background: `linear-gradient(to right, ${ThemeColors.accent}20, transparent)`,
                }}
              />

              <motion.div
                className="flex items-center opacity-60"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${ThemeColors.accent}10`,
                  }}
                >
                  <span className="text-xs font-medium text-gray-400">2</span>
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Business Profile
                </span>
              </motion.div>

              <div
                className="h-[2px] w-16"
                style={{
                  background: `linear-gradient(to right, ${ThemeColors.accent}10, transparent)`,
                }}
              />

              <motion.div
                className="flex items-center opacity-60"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${ThemeColors.accent}10`,
                  }}
                >
                  <span className="text-xs font-medium text-gray-400">3</span>
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Ready!
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ background: `${ThemeColors.accent}15` }}
            className="mb-3 inline-block rounded-full px-4 py-1.5"
          >
            <span className="font-medium text-accent">Step 1 of 2</span>
          </motion.div>

          <motion.h1
            className="text-text dark:text-darkText mb-4 text-center text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h1>

          <motion.p
            className="text-secondaryText dark:text-darkSecondaryText mx-auto max-w-2xl text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Select the perfect plan for your business and start transforming
            your customer service experience
          </motion.p>
        </div>
      </div>

      <PricingSection />
    </main>
  );
}
