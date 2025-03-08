"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";

const partners = [
  { name: "DCCS", logo: "/logos/ccs-logo.png" },
  { name: "4xPILLARS", logo: "/logos/4xpillar.png" },
  { name: "FARMOVATION", logo: "/logos/farmovation.png" },
  { name: "FARM", logo: "/logos/farmovation.png" },
  { name: "4x", logo: "/logos/4xpillar.png" },
];

export const TrustedCompanies = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <section
      className="relative overflow-hidden border-t border-b border-opacity-5"
      style={{
        backgroundColor: isDark
          ? "rgba(9, 9, 11, 0.8)"
          : "rgba(250, 250, 250, 0.7)",
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0">
        {/* <<div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${
              isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.008)"
            } 1px, transparent 1px), 
              linear-gradient(90deg, ${
                isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.008)"
              } 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: 0.7,
          }}
        /> */}
        {/* Accent line */}
        <motion.div
          className="absolute h-[1px] w-full bottom-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}20, transparent)`,
          }}
          animate={{ left: ["-100%", "100%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="py-8 md:py-10">
          {/* Elegant title - subtly different from previous design */}
          <motion.div
            className="mb-8 md:mb-10 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="h-[1px] w-8 opacity-40"
                style={{ backgroundColor: ThemeColors.accent }}
              />
              <h3
                className={`text-xs font-medium tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                TRUSTED PARTNERSHIPS
              </h3>
              <div
                className="h-[1px] w-8 opacity-40"
                style={{ backgroundColor: ThemeColors.accent }}
              />
            </div>

            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Powering innovative customer experiences across industries
            </p>
          </motion.div>

          {/* Refined logo display */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                className="group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <div className="relative h-6 md:h-8 w-28 md:w-32">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain filter grayscale hover:grayscale-0 
                      opacity-75 hover:opacity-100 transition-all duration-300"
                    sizes="(max-width: 768px) 40vw, 150px"
                  />
                </div>

                {/* Subtle hover indicator */}
                <motion.div
                  className="h-[1px] w-full mt-1.5 opacity-0 group-hover:opacity-100"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: ThemeColors.accent,
                    transformOrigin: "left",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Subtle end decoration */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: ThemeColors.accent }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
