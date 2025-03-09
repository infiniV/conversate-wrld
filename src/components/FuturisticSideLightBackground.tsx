"use client";

import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useEffect, useState } from "react";

export const FuturisticSideLightBackground = ({
  side = "both",
  intensity = 0.6,
}: {
  side?: "left" | "right" | "both";
  intensity?: number;
}) => {
  // Responsive values based on viewport
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

  const generateSideBeams = (isLeft: boolean) => {
    const width = dimensions.width;
    const height = dimensions.height;
    const startX = isLeft ? 0 : width;
    const endX = isLeft ? width * 0.4 : width * 0.6;

    return [
      // Main diagonal beam
      `M${startX},${height * 0.2} L${endX},${height * 0.4}`,
      `M${startX},${height * 0.5} L${endX},${height * 0.6}`,
      `M${startX},${height * 0.8} L${endX},${height * 0.7}`,
    ];
  };

  const leftPaths =
    side === "left" || side === "both" ? generateSideBeams(true) : [];
  const rightPaths =
    side === "right" || side === "both" ? generateSideBeams(false) : [];

  const maxDimension = Math.max(dimensions.width, dimensions.height);
  const scaleFactor = maxDimension / 1000;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Left side beams */}
      {leftPaths.length > 0 && (
        <svg className="absolute h-full w-full">
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor={ThemeColors.accent}
                stopOpacity={intensity}
              />
              <stop
                offset="100%"
                stopColor={ThemeColors.accent}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {leftPaths.map((path, index) => (
            <motion.path
              key={`left-${index}`}
              d={path}
              stroke="url(#beamGradient)"
              strokeWidth={Math.max(2, (6 - index * 2) * scaleFactor)}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                pathLength: { duration: 2, delay: index * 0.3 },
                opacity: { duration: 3, repeat: Infinity, delay: index * 0.3 },
              }}
            />
          ))}
        </svg>
      )}

      {/* Right side beams */}
      {rightPaths.length > 0 && (
        <svg className="absolute h-full w-full">
          <defs>
            <linearGradient
              id="rightBeamGradient"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={ThemeColors.accent}
                stopOpacity={intensity}
              />
              <stop
                offset="100%"
                stopColor={ThemeColors.accent}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {rightPaths.map((path, index) => (
            <motion.path
              key={`right-${index}`}
              d={path}
              stroke="url(#rightBeamGradient)"
              strokeWidth={Math.max(2, (6 - index * 2) * scaleFactor)}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                pathLength: { duration: 2, delay: 0.5 + index * 0.3 },
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  delay: 0.5 + index * 0.3,
                },
              }}
            />
          ))}
        </svg>
      )}

      {/* Side light sources */}
      {(side === "left" || side === "both") && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            width: `${Math.max(60, 120 * scaleFactor)}px`,
            height: `${Math.max(200, 400 * scaleFactor)}px`,
            background: `linear-gradient(90deg, ${ThemeColors.accent}40 0%, transparent 100%)`,
            filter: `blur(${Math.max(20, 40 * scaleFactor)}px)`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {(side === "right" || side === "both") && (
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{
            width: `${Math.max(60, 120 * scaleFactor)}px`,
            height: `${Math.max(200, 400 * scaleFactor)}px`,
            background: `linear-gradient(-90deg, ${ThemeColors.accent}40 0%, transparent 100%)`,
            filter: `blur(${Math.max(20, 40 * scaleFactor)}px)`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      )}

      {/* Minimal floating particles */}
      {Array.from({ length: 6 }).map((_, i) => {
        const isLeftSide = i % 2 === 0;
        if (
          (isLeftSide && side !== "right") ||
          (!isLeftSide && side !== "left")
        ) {
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.max(2, 4 * scaleFactor)}px`,
                height: `${Math.max(2, 4 * scaleFactor)}px`,
                backgroundColor: ThemeColors.accent,
                boxShadow: `0 0 ${Math.max(4, 8 * scaleFactor)}px ${
                  ThemeColors.accent
                }`,
                left: isLeftSide
                  ? `${10 + Math.random() * 20}%`
                  : `${70 + Math.random() * 20}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                x: [0, isLeftSide ? 40 : -40, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};
