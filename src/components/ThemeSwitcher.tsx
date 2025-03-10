"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { ThemeColors } from "./ThemeConstants";
import React from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform([mouseX, mouseY], (latest: number[]) => {
    return `radial-gradient(100px circle at ${latest[0]}px ${latest[1]}px, ${ThemeColors.accent}20, transparent)`;
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="group relative">
        {/* Ambient glow effect */}
        <motion.div
          className="absolute -inset-3 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-50"
          style={{
            background: `radial-gradient(circle at center, ${ThemeColors.accent}30 0%, transparent 70%)`,
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.button
          onClick={toggleTheme}
          onMouseMove={handleMouseMove}
          className="relative flex h-10 w-[88px] items-center justify-center overflow-hidden backdrop-blur-sm"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            background: theme === "dark" 
              ? "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)" 
              : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
            border: `1px solid ${ThemeColors.accent}${theme === "dark" ? "20" : "15"}`,
            boxShadow: theme === "dark"
              ? `0 4px 15px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`
              : `0 4px 15px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.9)`,
          }}
          whileHover={{
            scale: 1.02,
            y: -1,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98, y: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Fine grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12]"
            style={{
              backgroundImage:
                theme === "dark"
                  ? "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
                  : "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* Mouse follow light effect - Using useTransform */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
            style={{ background }}
          />

          {/* Icons container */}
          <div className="relative flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 10, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -10, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    scale: theme === "dark" ? 1 : 0.85,
                    opacity: theme === "dark" ? 1 : 0.3,
                    rotate: theme === "dark" ? 0 : -90,
                  }}
                  whileHover={{ scale: theme === "dark" ? 1.1 : 0.9 }}
                  style={{ color: theme === "dark" ? ThemeColors.accent : "#9CA3AF" }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon size={16} strokeWidth={2} />
                </motion.div>
                <motion.div
                  animate={{
                    scale: theme === "light" ? 1 : 0.85,
                    opacity: theme === "light" ? 1 : 0.3,
                    rotate: theme === "light" ? 0 : 90,
                  }}
                  whileHover={{ scale: theme === "light" ? 1.1 : 0.9 }}
                  style={{ color: theme === "light" ? ThemeColors.accent : "#9CA3AF" }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun size={16} strokeWidth={2} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Active indicator bar */}
          <motion.div
            layoutId="themeIndicator"
            className="absolute right-2 h-3 w-0.5 opacity-60"
            initial={false}
            animate={{
              top: "50%",
              y: "-50%",
              backgroundColor: ThemeColors.accent,
            }}
            style={{
              boxShadow: `0 0 8px ${ThemeColors.accent}80`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-10 group-hover:opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}30, transparent)`,
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.button>

        {/* Bottom edge accent */}
        <div
          className="absolute -bottom-px left-1 right-1 h-[1px] opacity-40 transition-opacity duration-300 group-hover:opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`,
          }}
        />
      </div>
    </div>
  );
};
