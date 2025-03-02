"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Brain, MessageSquare, Zap, Network } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { ThemeColors, ThemeTransitions } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { CentralFeatureHub } from "./CentralFeatureHub";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import { Loader } from "@/components/ui/loader";

// Features using ThemeColors
const features = [
  {
    title: "AI-Powered Intelligence",
    description:
      "Advanced natural language processing for human-like conversations with context awareness and emotional intelligence.",
    icon: Brain,
    color: ThemeColors.secondaryAccents.slate,
  },
  {
    title: "Multi-Channel Support",
    description:
      "Seamless communication across web, mobile, voice, SMS, and social media with consistent context.",
    icon: Network,
    color: ThemeColors.secondaryAccents.emerald,
  },
  {
    title: "Real-Time Responses",
    description:
      "Lightning-fast processing for immediate answers while handling thousands of conversations simultaneously.",
    icon: Zap,
    color: ThemeColors.secondaryAccents.amber,
  },
  {
    title: "Natural Conversations",
    description:
      "Context-aware dialogue that remembers previous interactions and responds to complex queries naturally.",
    icon: MessageSquare,
    color: ThemeColors.secondaryAccents.cyan,
  },
];

export const OrbFeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <section
      className="w-full py-16"
      style={{
        backgroundColor: isDark
          ? ThemeColors.dark.background
          : ThemeColors.light.background,
        color: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
        transition: ThemeTransitions.default,
      }}
    >
      {/* Title area with site-matching styling */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3"
        >
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: ThemeColors.accent }}
          >
            Core Technologies
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              color: isDark
                ? ThemeColors.dark.secondaryText
                : ThemeColors.light.secondaryText,
            }}
          >
            Explore the advanced capabilities behind Conversate&apos;s
            intelligent system
          </p>
        </motion.div>
      </div>

      {/* More compact 3D visualization with site-matching styling */}
      <div className="relative w-full mb-8">
        <div
          className="w-full max-w-4xl mx-auto aspect-[16/9] rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${
              isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
            }`,
            boxShadow: isDark
              ? "0 10px 25px -5px rgba(0,0,0,0.5)"
              : "0 10px 25px -5px rgba(0,0,0,0.1)",
          }}
        >
          <Canvas
            shadows
            camera={{
              position: [0, 0, 6],
              fov: activeFeature !== null ? 40 : 45, // Narrower FOV when focused on a feature
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
            frameloop="demand"
          >
            <color
              attach="background"
              args={[
                isDark
                  ? ThemeColors.dark.background
                  : ThemeColors.light.background,
              ]}
            />

            <ambientLight intensity={isDark ? 0.2 : 0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />

            {/* Add a subtle spotlight that follows the active feature */}
            {activeFeature !== null && (
              <spotLight
                position={[
                  activeFeature === 0 ? -3 : activeFeature === 1 ? 3 : 0,
                  activeFeature === 2 ? 3 : activeFeature === 3 ? -3 : 0,
                  5,
                ]}
                angle={0.3}
                penumbra={0.8}
                intensity={0.8}
                distance={15}
                color={features[activeFeature].color}
                castShadow
              />
            )}

            <Suspense fallback={null}>
              <CentralFeatureHub
                activeFeature={activeFeature}
                onFeatureSelect={setActiveFeature}
                features={features}
                isDark={isDark}
              />

              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={isDark ? 0.3 : 0.2}
                />
              </EffectComposer>
            </Suspense>
          </Canvas>

          {/* Loading indicator */}
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Suspense>
              <Loader size="md" />
            </Suspense>
          </div> */}

          {/* Instruction overlay with site-matching styling */}
          {activeFeature === null && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div
                className="px-4 py-2 rounded-full backdrop-blur-sm text-sm flex items-center gap-2 shadow-sm"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  color: isDark
                    ? ThemeColors.dark.text
                    : ThemeColors.light.text,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: ThemeColors.accent }}
                ></span>
                <span style={{ fontSize: "0.8rem" }}>
                  Explore features by clicking nodes
                </span>
              </div>
            </div>
          )}

          {/* Back button with site-matching styling */}
          {activeFeature !== null && (
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setActiveFeature(null)}
                className="px-3 py-1.5 rounded-full backdrop-blur-sm text-xs flex items-center gap-1.5 transition-colors"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  border: `1px solid ${
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                  }`,
                  color: isDark
                    ? ThemeColors.dark.text
                    : ThemeColors.light.text,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>
            </div>
          )}
        </div>

        {/* Simpler feature details in footer */}
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="flex justify-center">
            {activeFeature === null ? (
              <div className="text-center">
                <p
                  className="text-xs opacity-60"
                  style={{
                    color: isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText,
                  }}
                >
                  Click on a node to learn more about each feature
                </p>
              </div>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  className="text-lg font-medium mb-1"
                  style={{ color: features[activeFeature].color }}
                >
                  {features[activeFeature].title}
                </h3>
                <p
                  className="text-sm max-w-lg mx-auto"
                  style={{
                    color: isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText,
                  }}
                >
                  {features[activeFeature].description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
