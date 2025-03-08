"use client";

import React from "react";
import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";

export const TrustedCompaniesBackground: React.FC = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Use theme background colors
  //   const bgColor = isDark ? ThemeColors.dark.background : ThemeColors.light.background;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Theme-aware gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(to right, ${ThemeColors.dark.background}, rgba(9,9,11,0.95), ${ThemeColors.dark.background})`
            : "black", // Keep it black for this specific component as per design
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          opacity: isDark ? 0.3 : 0.2,
        }}
      />

      {/* Top and bottom accent lines */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`,
        }}
      />

      {/* Subtle glow effect */}
      <motion.div
        className="absolute -left-20 top-0 w-40 h-full opacity-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}30, transparent)`,
          filter: "blur(30px)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
};

export default TrustedCompaniesBackground;
