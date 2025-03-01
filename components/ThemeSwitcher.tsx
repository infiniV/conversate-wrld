"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import React from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const variants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Icon components based on current theme
  const CurrentThemeIcon = () => {
    if (theme === "dark") return <Moon size={16} />;
    if (theme === "light") return <Sun size={16} />;
    return <Monitor size={16} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            background:
              theme === "dark"
                ? "linear-gradient(135deg, rgba(255, 61, 113, 0.2), rgba(6, 182, 212, 0.2))"
                : "linear-gradient(135deg, rgba(255, 61, 113, 0.8), rgba(6, 182, 212, 0.8))",
            boxShadow:
              theme === "dark"
                ? "0 0 15px rgba(255, 61, 113, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                : "0 2px 10px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
          }}
        >
          <motion.div
            whileHover={{ rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="text-white"
          >
            <CurrentThemeIcon />
          </motion.div>
        </button>

        {/* Dropdown menu */}
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={variants}
          className="absolute bottom-full mb-2 right-0 overflow-hidden"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            background:
              theme === "dark"
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border:
              theme === "dark"
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow:
              theme === "dark"
                ? "0 10px 25px rgba(0, 0, 0, 0.5)"
                : "0 10px 25px rgba(0, 0, 0, 0.1)",
            width: "140px",
          }}
        >
          <div className="p-2 flex flex-col gap-1">
            {/* Dark theme option */}
            <ThemeOption
              icon={<Moon size={14} />}
              label="Dark"
              onClick={() => toggleTheme("dark")}
              active={theme === "dark"}
              currentTheme={theme}
            />

            {/* Light theme option */}
            <ThemeOption
              icon={<Sun size={14} />}
              label="Light"
              onClick={() => toggleTheme("light")}
              active={theme === "light"}
              currentTheme={theme}
            />

            {/* System theme option */}
            <ThemeOption
              icon={<Monitor size={14} />}
              label="System"
              onClick={() => toggleTheme("system")}
              active={theme === "system"}
              currentTheme={theme}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
  currentTheme: string | undefined;
}

const ThemeOption = ({
  icon,
  label,
  onClick,
  active,
  currentTheme,
}: ThemeOptionProps) => {
  const isDark = currentTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center w-full gap-2 px-3 py-1.5 text-left text-xs rounded-sm
        ${
          active
            ? isDark
              ? "bg-white/10 text-white"
              : "bg-black/10 text-black"
            : isDark
            ? "text-gray-300 hover:text-white"
            : "text-gray-700 hover:text-black"
        }
      `}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
      }}
    >
      <span className="opacity-80">{icon}</span>
      <span className="font-medium tracking-wide">{label}</span>

      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-1 h-3"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, #FF3D71, #06B6D4)"
              : "linear-gradient(to bottom, #FF3D71, #06B6D4)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
