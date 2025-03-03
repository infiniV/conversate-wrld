"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";

export const FuturisticBackground = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${
            isDark ? "rgba(24, 24, 27, 0.8)" : "rgba(255, 255, 255, 0.9)"
          } 1px, transparent 1px), 
          linear-gradient(90deg, ${
            isDark ? "rgba(24, 24, 27, 0.8)" : "rgba(255, 255, 255, 0.9)"
          } 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.1,
        }}
      />

      {/* Animated circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}20 0%, transparent 70%)`,
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated lines */}
      <svg
        className="absolute w-full h-full opacity-[0.15]"
        style={{
          stroke: ThemeColors.accent,
          strokeWidth: "1",
          fill: "none",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M${-100 + i * 400},0 Q${100 + i * 400},${500} ${
              -100 + i * 400
            },1000`}
            animate={{
              d: [
                `M${-100 + i * 400},0 Q${100 + i * 400},${500} ${
                  -100 + i * 400
                },1000`,
                `M${-50 + i * 400},0 Q${200 + i * 400},${500} ${
                  -50 + i * 400
                },1000`,
                `M${-100 + i * 400},0 Q${100 + i * 400},${500} ${
                  -100 + i * 400
                },1000`,
              ],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
