"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";
import Image from "next/image";
import { useEffect, useState } from "react";

const companies = [
  { name: "DCCS", logo: "/logos/ccs-logo.png" },
  { name: "4xPILLARS", logo: "/logos/4xpillar.png" },
  { name: "FARMOVATION", logo: "/logos/farmovation.png" },
];

// Polygon background shapes
const polygons = [
  "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
  "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
];

export const TrustedCompanies = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(companies.length / 3);
  const displayedCompanies = companies.slice(
    currentPage * 3,
    (currentPage + 1) * 3
  );

  // Auto-pagination effect
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMounted, totalPages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="py-4 overflow-hidden relative">
      {/* Polygonal background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => {
          const size = 20 + Math.random() * 60;
          const shape = polygons[index % polygons.length];
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const rotation = Math.random() * 360;

          return (
            <div
              key={`polygon-${index}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                transform: `rotate(${rotation}deg)`,
                clipPath: shape,
                background: isDark
                  ? `rgba(255, 61, 113, ${0.01 + Math.random() * 0.04})`
                  : `rgba(255, 61, 113, ${0.005 + Math.random() * 0.02})`,
                opacity: 0.3 + Math.random() * 0.4,
                zIndex: -1,
              }}
            />
          );
        })}
      </div>

      {/* Light gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isDark
            ? "linear-gradient(90deg, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0) 50%, rgba(9,9,11,0.5) 100%)"
            : "linear-gradient(90deg, rgba(250,250,250,0.7) 0%, rgba(250,250,250,0) 50%, rgba(250,250,250,0.7) 100%)",
        }}
      />

      {/* Accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3D71] to-transparent opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF3D71] to-transparent opacity-30" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between">
          {/* Left side - Title with enhanced styling */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ThemeColors.accent,
                  boxShadow: `0 0 8px ${ThemeColors.accent}80`,
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.5, 0], scale: [1, 2] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: `${ThemeColors.accent}20`,
                }}
              />
            </div>

            <div>
              <motion.p
                className={`text-xs font-bold tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ color: ThemeColors.accent }}>TRUSTED</span> BY
              </motion.p>
            </div>
          </div>

          {/* Right side - Companies with refined cards */}
          <div className="flex-1 flex items-center justify-end">
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key={currentPage}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {displayedCompanies.map((company, index) => (
                <motion.div
                  key={`company-${currentPage}-${index}`}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-1.5 transition-all duration-200"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      backgroundColor: isDark
                        ? "rgba(24, 24, 27, 0.7)"
                        : "rgba(255, 255, 255, 0.7)",
                      border: `1px solid ${
                        isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)"
                      }`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Company logo */}
                    <div
                      className="relative h-5 w-5 flex items-center justify-center"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                        backgroundColor: isDark
                          ? "rgba(15, 15, 18, 0.8)"
                          : "rgba(245, 245, 247, 0.8)",
                        padding: "3px",
                        border: `1px solid ${
                          isDark
                            ? "rgba(255, 255, 255, 0.06)"
                            : "rgba(0, 0, 0, 0.03)"
                        }`,
                      }}
                    >
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        sizes="20px"
                        className={`object-contain p-0.5 ${
                          isDark ? "brightness-110" : ""
                        }`}
                      />
                    </div>

                    {/* Company name */}
                    <span
                      className={`text-xs font-medium tracking-wide ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {company.name}
                    </span>

                    {/* Bottom highlight line - only visible on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        backgroundColor: ThemeColors.accent,
                        transformOrigin: "left",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
