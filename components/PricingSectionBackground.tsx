"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  delay: number;
  color: string;
}

export const PricingSectionBackground = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars with random positions, properties and themed colors
  useEffect(() => {
    // Create an array of available star colors from theme
    const starColors = [
      ThemeColors.accent,
      ThemeColors.secondaryAccents.cyan,
      ThemeColors.secondaryAccents.emerald,
      ThemeColors.secondaryAccents.amber,
      "#FFFFFF",
    ];
    const generateStars = () => {
      const starCount = 100;
      const newStars = [];

      for (let i = 0; i < starCount; i++) {
        // Choose a color with weighted probability (more white/accent in dark mode, more colored in light mode)
        const colorIndex = Math.floor(Math.random() * (isDark ? 5 : 4)); // In dark mode, add more probability for white

        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 3 + 2,
          delay: Math.random() * 5,
          color: starColors[colorIndex],
        });
      }

      setStars(newStars);
    };

    generateStars();
    generateStars();
  }, [isDark]);
  return (
    <div className="border-t-2 border-gray-800/45 absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(to bottom, ${ThemeColors.dark.background}f5, ${ThemeColors.dark.background}90)`
            : `linear-gradient(to bottom, ${ThemeColors.light.background}95, ${ThemeColors.light.background}60)`,
          opacity: 0.98,
        }}
      />

      {/* Starry background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.size > 2 ? `0 0 4px 1px ${star.color}40` : "none",
            }}
            animate={{
              opacity: [
                star.opacity * 0.8,
                star.opacity * 1.2,
                star.opacity * 0.8,
              ],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: star.twinkleSpeed,
              delay: star.delay,
              repeatDelay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shooting stars with theme-based colors */}
      {[1, 2, 3].map((i) => {
        const shootingStarColor =
          i === 1
            ? ThemeColors.accent
            : i === 2
            ? ThemeColors.secondaryAccents.cyan
            : ThemeColors.secondaryAccents.amber;

        return (
          <motion.div
            key={`shooting-${i}`}
            className="absolute h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${shootingStarColor}, transparent)`,
              top: `${15 + i * 25}%`,
              left: "0%",
              width: "120px",
              transform: "rotate(-45deg)",
              opacity: 0,
            }}
            animate={{
              x: ["0%", "100vw"],
              opacity: [0, 0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 7 + 5,
              repeatDelay: i * 5 + 15,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Nebula effects with varied theme colors */}
      {[ThemeColors.accent, ThemeColors.secondaryAccents.cyan].map(
        (color, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(ellipse at center, ${color}08, ${color}05, transparent 70%)`,
              width: `${600 + i * 400}px`,
              height: `${600 + i * 400}px`,
              left: `${i === 0 ? 70 : 20}%`,
              top: `${i === 0 ? 20 : 60}%`,
              filter: "blur(80px)",
              opacity: isDark ? 0.15 : 0.1,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: isDark ? [0.15, 0.2, 0.15] : [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        )
      )}

      {/* Bottom glow using accent gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[400px]"
        style={{
          background: `linear-gradient(to top, ${ThemeColors.accent}10, ${ThemeColors.secondaryAccents.cyan}05, transparent)`,
          opacity: isDark ? 0.08 : 0.05,
        }}
        animate={{
          opacity: isDark ? [0.08, 0.12, 0.08] : [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
