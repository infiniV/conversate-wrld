"use client";

import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useEffect, useState } from "react";

export const TechnologicalBackground = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateLinePaths = () => {
    const paths = [];
    const segments = 6; // Increased for more density
    const spacing = dimensions.height / (segments + 1);

    // Flowing horizontal lines with wave effect
    for (let i = 1; i <= segments; i++) {
      paths.push({
        d: `M-50,${spacing * i} C${dimensions.width * 0.3},${
          spacing * i - 100
        } ${dimensions.width * 0.7},${spacing * i + 100} ${
          dimensions.width + 50
        },${spacing * i}`,
        delay: i * 0.2,
        duration: 15 + i,
        opacity: 0.6 - (i % 3) * 0.15,
      });
    }

    // Ascending diagonal lines
    for (let i = 1; i <= 3; i++) {
      const startY = dimensions.height - (i * dimensions.height) / 8;
      paths.push({
        d: `M-50,${startY} Q${dimensions.width * 0.5},${startY - 200} ${
          dimensions.width + 50
        },${startY - 400}`,
        delay: i * 0.3,
        duration: 10 + i,
        opacity: 0.7,
      });
    }

    // Descending flowing lines
    for (let i = 1; i <= 3; i++) {
      const startY = (i * dimensions.height) / 8;
      paths.push({
        d: `M-50,${startY} Q${dimensions.width * 0.5},${startY + 200} ${
          dimensions.width + 50
        },${startY + 400}`,
        delay: i * 0.3 + 0.5,
        duration: 10 + i,
        opacity: 0.7,
      });
    }

    return paths;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full opacity-[0.3]">
        <defs>
          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={ThemeColors.accent}
              stopOpacity="0.9"
            />
            <stop
              offset="100%"
              stopColor={ThemeColors.accent}
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>

        {generateLinePaths().map((path, index) => (
          <motion.path
            key={`line-${index}`}
            d={path.d}
            stroke="url(#techGradient)"
            strokeWidth={index % 4 === 0 ? "2" : "1"}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, path.opacity, 0],
            }}
            transition={{
              pathLength: {
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
        ))}
      </svg>

      {/* Enhanced gradient orbs with adjusted positioning */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}20 0%, transparent 70%)`,
            width: `${1200 + i * 400}px`,
            height: `${1200 + i * 400}px`,
            left: `${i * 30 - 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
