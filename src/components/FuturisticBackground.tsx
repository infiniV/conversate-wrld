"use client";

import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";

export const FuturisticBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      {/* <div
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
      /> */}

      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}20 0%, transparent 70%)`,
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            left: `${20 + i * 30}%`,
            top: `${Math.min(20 + i * 20, 30)}%`, // Capping the top position at 70%
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, Math.min(20, 70 - (20 + i * 20)), 0], // Adjusting y animation to stay within bounds
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
      {/* <svg
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
            d={`M0,${-100 + i * 400} Q${window.innerWidth / 2},${
              100 + i * 400
            } ${window.innerWidth},${-100 + i * 400}`}
            animate={{
              d: [
                `M0,${-100 + i * 400} Q${window.innerWidth / 2},${
                  100 + i * 400
                } ${window.innerWidth},${-100 + i * 400}`,
                `M0,${-50 + i * 400} Q${window.innerWidth / 2},${
                  200 + i * 400
                } ${window.innerWidth},${-50 + i * 400}`,
                `M0,${-100 + i * 400} Q${window.innerWidth / 2},${
                  100 + i * 400
                } ${window.innerWidth},${-100 + i * 400}`,
              ],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg> */}
    </div>
  );
};
