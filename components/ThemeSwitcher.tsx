"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { ThemeColors } from "./ThemeConstants";
import React from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={toggleTheme}
        className="flex items-center gap-4 px-5 py-2.5 text-left text-xs relative overflow-hidden"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          background: theme === "dark" ? "#000000" : "#FFFFFF",
          border: `1px solid ${ThemeColors.accent}20`,
          boxShadow:
            theme === "dark"
              ? `0 0 20px rgba(0, 0, 0, 0.4), 0 0 15px ${ThemeColors.accent}15`
              : `0 4px 15px rgba(0, 0, 0, 0.1), 0 0 15px ${ThemeColors.accent}10`,
        }}
        whileHover={{
          scale: 1.02,
          y: -1,
          borderColor: `${ThemeColors.accent}40`,
        }}
        whileTap={{ scale: 0.98, y: 1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              theme === "dark"
                ? "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
                : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Icons container */}
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            animate={{
              scale: theme === "dark" ? 1 : 0.85,
              opacity: theme === "dark" ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={theme === "dark" ? "text-cyan-400" : "text-gray-400"}
          >
            <Moon size={15} />
          </motion.div>
          <motion.div
            animate={{
              scale: theme === "light" ? 1 : 0.85,
              opacity: theme === "light" ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={theme === "light" ? "text-amber-500" : "text-gray-400"}
          >
            <Sun size={15} />
          </motion.div>
        </div>

        {/* Slider background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={false}
          animate={{
            x: theme === "dark" ? "0%" : "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: "50%",
            background:
              theme === "dark"
                ? "linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))"
                : "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))",
            borderRight: `1px solid ${ThemeColors.accent}20`,
          }}
        />

        {/* Active indicator */}
        <motion.div
          layoutId="themeIndicator"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-1"
          style={{
            background: ThemeColors.accent,
            boxShadow: `0 0 10px ${ThemeColors.accent}80`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};
