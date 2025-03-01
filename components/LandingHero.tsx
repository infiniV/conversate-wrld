"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { OrbComponent } from "./OrbComponent";
import { ThemeColors, ThemeTransitions } from "./ThemeConstants";
import { useTheme } from "next-themes";

export const LandingHero = () => {
  const [loaded, setLoaded] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Mount effect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load effect for animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  // Theme-aware styles
  const styles = {
    // Base colors
    background: isDark
      ? ThemeColors.dark.background
      : ThemeColors.light.background,
    text: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
    secondaryText: isDark
      ? ThemeColors.dark.secondaryText
      : ThemeColors.light.secondaryText,
    border: isDark ? ThemeColors.dark.border : ThemeColors.light.border,
    subtleUI: isDark ? ThemeColors.dark.subtleUI : ThemeColors.light.subtleUI,

    // Special styles
    textGradient: isDark
      ? "from-white to-gray-300"
      : "from-gray-900 to-gray-700",
    tagBackground: isDark
      ? "bg-[rgba(255,61,113,0.15)]"
      : "bg-[rgba(255,61,113,0.08)]",
    tagBorder: isDark ? "border-[#FF3D71]/20" : "border-[#FF3D71]/15",
    featureIconBackground: isDark
      ? "bg-[rgba(255,255,255,0.1)]"
      : "bg-[rgba(0,0,0,0.05)]",
    featureTextColor: isDark ? "text-white/70" : "text-gray-700/80",
    decorativeBorder: isDark ? "border-white/10" : "border-black/5",
    decorationOpacity: isDark ? 0.3 : 0.15,
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        isDark ? "bg-[#09090B] text-[#FFFFFF]" : "bg-[#FAFAFA] text-[#111827]"
      } transition-colors`}
      style={{ transition: ThemeTransitions.default }}
    >
      {/* Central Orb - Positioned to be prominent in center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Increased the size for more prominence */}
        <div className="w-[100vw] h-[100vh] absolute opacity-90">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{
              touchAction: "none",
              filter: isDark ? "none" : "contrast(1.05) brightness(1.05)",
            }}
            eventSource={document.documentElement}
            eventPrefix="client"
          >
            <ambientLight intensity={isDark ? 0.5 : 0.7} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={isDark ? 1 : 1.2}
            />
            <Suspense fallback={null}>
              <OrbComponent
                color={ThemeColors.accent}
                hoverColor={ThemeColors.secondaryAccents.cyan}
                grainCount={2000} // Increased grain count
                radius={1.6} // Larger radius for more dominance
                grainSize={0.015}
                vertexColors={false}
                rotationSpeed={0.04}
                pulsateSpeed={0.12}
                noiseStrength={isDark ? 0.14 : 0.12}
                pulsateStrength={isDark ? 0.03 : 0.025}
                distortionStrength={0.6}
              />
            </Suspense>
          </Canvas>

          {/* Subtle audio wave hints */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,50 Q25,45 50,50 T100,50"
                fill="none"
                stroke={ThemeColors.accent}
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M0,50 Q25,55 50,50 T100,50"
                fill="none"
                stroke={ThemeColors.secondaryAccents.cyan}
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Overlay - Centered over the orb */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className={`inline-block mb-3 px-4 py-1.5 ${styles.tagBackground} ${styles.tagBorder} backdrop-blur-sm border rounded-md`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="text-xs font-semibold tracking-widest text-[#FF3D71] uppercase">
                Redefining Communication
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              The Future of{" "}
              <span className="text-[#FF3D71]">Customer Care</span>
            </motion.h1>

            <motion.p
              className={`text-base md:text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              } mb-8 mx-auto max-w-xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Seamless interactions across all channels. Deliver exceptional
              experiences through our intelligent autonomous system.
            </motion.p>

            {/* Centered buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/get-started"
                className="flex items-center justify-center text-sm font-semibold text-white px-7 py-3.5 gap-3 w-full sm:w-auto"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  backgroundColor: ThemeColors.accent,
                  boxShadow: `0 0 20px ${ThemeColors.accent}4D, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 0 25px ${ThemeColors.accent}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <span className="tracking-wider">GET CONVERSATE</span>
                <ArrowRight size={16} />
              </motion.a>

              <motion.a
                href="/demo"
                className="flex items-center justify-center text-sm font-semibold px-7 py-3.5 gap-3 w-full sm:w-auto"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(0,0,0,0.1)",
                  background: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
                  backdropFilter: "blur(12px)",
                  color: isDark ? "#FFFFFF" : "#111827",
                }}
                whileHover={{
                  scale: 1.02,
                  background: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="tracking-wider">TRY CONVERSATE</span>
              </motion.a>
            </div>

            {/* Centered features */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? (isDark ? 0.9 : 0.85) : 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.featureIconBackground}`}
                >
                  <MessageSquare
                    size={14}
                    className={styles.featureTextColor}
                  />
                </div>
                <span className={`text-sm ${styles.featureTextColor}`}>
                  Conversation Intelligence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.featureIconBackground}`}
                >
                  <Phone size={14} className={styles.featureTextColor} />
                </div>
                <span className={`text-sm ${styles.featureTextColor}`}>
                  Multimodal Interaction
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements positioned symmetrically */}
        <motion.div
          className={`absolute bottom-8 right-8 md:bottom-16 md:right-16 w-28 h-28 border ${styles.decorativeBorder}`}
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{
            opacity: loaded ? styles.decorationOpacity : 0,
            scale: loaded ? 1 : 0.8,
            rotate: loaded ? 0 : -5,
          }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />

        <motion.div
          className="absolute bottom-8 left-8 md:bottom-16 md:left-16 w-28 h-28 border"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            border: `1px solid ${ThemeColors.accent}33`,
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{
            opacity: loaded ? styles.decorationOpacity - 0.1 : 0,
            scale: loaded ? 1 : 0.8,
            rotate: loaded ? 0 : 5,
          }}
          transition={{ delay: 1.3, duration: 0.8 }}
        />

        {/* Enhanced connection lines for symmetry */}
        <svg className="absolute inset-0 w-full h-full z-0 opacity-10 pointer-events-none">
          <motion.circle
            cx="20%"
            cy="30%"
            r="2"
            fill={ThemeColors.accent}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              delay: 2,
            }}
          />
          <motion.circle
            cx="80%"
            cy="30%"
            r="2"
            fill={ThemeColors.secondaryAccents.cyan}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              delay: 3,
            }}
          />
          <motion.path
            d="M20,30 Q50,5 80,30"
            stroke={ThemeColors.accent}
            strokeWidth="0.5"
            strokeDasharray="3,8"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1.5,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
};
