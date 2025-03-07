"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import dynamic from "next/dynamic";
import {
  Check,
  ChevronRight,
  ChevronDown,
  TreeDeciduous,
  Mic,
  Settings,
  ChartArea,
} from "lucide-react";
import { useTheme } from "next-themes";
import { FuturisticBackground } from "./FuturisticBackground";

// Dynamic import with loading component
const PowerBox3D = dynamic(
  () => import("./PowerBox3D").then((mod) => mod.PowerBox3D),
  {
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-32 h-32 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${ThemeColors.accent}20, transparent)`,
          }}
        >
          <div className="w-full h-full animate-pulse" />
        </motion.div>
      </div>
    ),
    ssr: false,
  }
);

const featureData = [
  {
    id: "omni-channel-support",
    title: "Omni-Channel Support",
    description:
      "Engage customers seamlessly across text messages, calls, and web interfaces with a unified experience.",
    icon: <TreeDeciduous />,
    detailedDescription:
      "Provide consistent customer care regardless of how your customers choose to reach you. Our platform integrates all communication channels into one cohesive system, ensuring your customers receive the same quality of service whether they text, call, or use your website.",
    benefits: [
      "Unified customer profiles across all communication methods",
      "Seamless handoffs between channels when needed",
      "Consistent brand voice and responses across all touchpoints",
    ],
  },
  {
    id: "voice-ai",
    title: "Advanced Voice Intelligence",
    description:
      "Natural-sounding voice interactions that understand context and respond appropriately to customer queries.",
    icon: <Mic />,
    detailedDescription:
      "Our voice technology understands natural language, recognizes customer intent, and responds with human-like conversation. With advanced speech recognition and natural language processing, our system handles complex interactions while maintaining context throughout the conversation.",
    benefits: [
      "Natural-sounding conversations with context awareness",
      "Accurate speech recognition even with background noise",
      "Real-time response generation with minimal latency",
    ],
  },
  {
    id: "business-customization",
    title: "Industry-Specific Solutions",
    description:
      "Tailored customer care experiences designed specifically for your business type, from restaurants to car washes.",
    icon: <Settings />,
    detailedDescription:
      "We don't believe in one-size-fits-all. Our platform adapts to your specific industry needs, whether you're managing reservations for a restaurant or scheduling appointments for a car wash. The system learns your business terminology, common requests, and customer expectations.",
    benefits: [
      "Industry-specific language models trained on your business type",
      "Custom workflows designed around your specific processes",
      "Specialized handling of common scenarios in your industry",
    ],
  },
  {
    id: "analytics-insights",
    title: "Customer Insights Dashboard",
    description:
      "Transform customer interactions into actionable business intelligence with comprehensive analytics.",
    icon: <ChartArea />,
    detailedDescription:
      "Gain valuable insights from every customer interaction. Our analytics platform identifies trends, highlights frequent customer needs, and helps you understand where your service excels or needs improvement. Make data-driven decisions to continuously enhance your customer experience.",
    benefits: [
      "Comprehensive reporting on customer satisfaction metrics",
      "Identification of common issues and request patterns",
      "ROI tracking to measure impact on operational efficiency",
    ],
  },
];

export const FeaturesSection = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Clean up animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Toggle expanded feature with animation lock to prevent jitter
  const toggleFeature = (id: string) => {
    if (animatingId !== null) return; // Prevent toggling during animation

    setAnimatingId(id);
    setExpandedFeature(expandedFeature === id ? null : id);

    // Clear animation lock after animation completes
    animationTimeoutRef.current = setTimeout(() => {
      setAnimatingId(null);
    }, 400); // Slightly longer than animation duration
  };

  return (
    <section
      className="min-h-screen flex items-center bg-gradient-to-b from-background to-subtleUI dark:from-darkBackground dark:to-darkSubtleUI relative"
      style={{
        borderTop: `1px solid ${
          isDark ? ThemeColors.dark.border : ThemeColors.light.border
        }`,
      }}
    >
      <FuturisticBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ background: ThemeColors.accent }}
            className="inline-block mb-3 px-4 py-1.5 rounded-full"
          >
            <span className="text-accent font-medium">
              Customer Service, Reimagined
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl font-bold mb-6 text-text dark:text-darkText"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Autonomous Customer Care
          </motion.h2>

          <motion.p
            className="text-xl text-secondaryText dark:text-darkSecondaryText max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tailored solutions that transform how businesses connect with
            customers, across every communication channel they prefer to use
          </motion.p>
        </div>

        {/* Two-column layout with PowerBox on left, feature details on right */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-6">
          {/* PowerBox Column with fade-in animation */}
          <motion.div
            className="lg:col-span-6 relative min-h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <PowerBox3D />
          </motion.div>

          {/* Feature Cards Column */}
          <div className="lg:col-span-6 flex flex-col space-y-4 will-change-transform">
            {featureData.map((feature) => {
              const isExpanded = expandedFeature === feature.id;
              return (
                <motion.div
                  key={feature.id}
                  layout="position"
                  layoutId={`card-${feature.id}`}
                  className="w-full overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    backgroundColor: isDark
                      ? "rgba(24, 24, 27, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${ThemeColors.accent}${
                      isDark ? "33" : "20"
                    }`,
                    boxShadow: isExpanded
                      ? `0 10px 25px -5px rgba(0, 0, 0, ${
                          isDark ? "0.3" : "0.1"
                        }), 0 4px 10px rgba(0, 0, 0, 0.04), 0 0 20px ${
                          ThemeColors.accent
                        }${isDark ? "30" : "20"}`
                      : `0 5px 15px -5px rgba(0, 0, 0, ${
                          isDark ? "0.25" : "0.05"
                        })`,
                    willChange:
                      isExpanded || animatingId === feature.id
                        ? "transform, opacity, height"
                        : "auto",
                  }}
                  initial={false} // Remove initial animation
                  transition={{
                    layout: {
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.4,
                    },
                  }}
                >
                  {/* Header - always visible */}
                  <div
                    className="w-full flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-lg text-xl"
                        style={{
                          backgroundColor: `${ThemeColors.accent}${
                            isExpanded ? "25" : "15"
                          }`,
                          color: ThemeColors.accent,
                        }}
                      >
                        {feature.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-text dark:text-darkText">
                          {feature.title}
                        </h3>
                        {!isExpanded && (
                          <p className="text-sm text-secondaryText dark:text-darkSecondaryText line-clamp-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "anticipate" }}
                      style={{ color: ThemeColors.accent }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>

                  {/* Expandable content with fixed height container to reduce layout shifts */}
                  <AnimatePresence initial={false} mode="popLayout">
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          opacity: { duration: 0.2, ease: "easeInOut" },
                          height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                        }}
                        style={{
                          overflow: "hidden",
                          willChange: "height, opacity",
                        }}
                      >
                        <div className="px-4 pb-4">
                          <div className="w-full h-[1px] mb-4 bg-gradient-to-r from-accent/30 to-transparent" />

                          <p className="text-secondaryText dark:text-darkSecondaryText mb-4">
                            {feature.detailedDescription}
                          </p>

                          <h4 className="font-semibold text-text dark:text-darkText mb-3 flex items-center gap-2">
                            <span
                              className="h-[3px] w-[16px]"
                              style={{ backgroundColor: ThemeColors.accent }}
                            />
                            <span>Key Benefits</span>
                          </h4>

                          <ul className="space-y-3 mb-2">
                            {feature.benefits.map((benefit, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-start gap-3 text-secondaryText dark:text-darkSecondaryText"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: 0.05 * idx,
                                }}
                              >
                                <div
                                  className="p-1 rounded-full mt-0.5 flex-shrink-0"
                                  style={{
                                    backgroundColor: `${ThemeColors.accent}15`,
                                  }}
                                >
                                  <Check
                                    size={14}
                                    style={{ color: ThemeColors.accent }}
                                    strokeWidth={2.5}
                                  />
                                </div>
                                <span>{benefit}</span>
                              </motion.li>
                            ))}
                          </ul>

                          <motion.button
                            className="flex items-center gap-1 mt-4 text-sm font-medium"
                            style={{
                              color: ThemeColors.accent,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>Explore Feature</span>
                            <ChevronRight size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
