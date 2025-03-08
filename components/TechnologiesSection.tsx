"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";
import {
  PhoneCall,
  Globe,
  MessageCircle,
  Code,
  ExternalLink,
  Server,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FuturisticBackground } from "./FuturisticBackground";

// Define the technology categories and items
const technologies = [
  {
    id: "telephony",
    title: "Telephony Integrations",
    description:
      "Connect your voice systems seamlessly with our advanced telephony integrations",
    icon: <PhoneCall />,
    items: [
      {
        name: "Twilio",
        description:
          "Deploy AI voice agents using Twilio's extensive telephony network",
        logo: "https://cdn.brandfetch.io/idSMSsgKor/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
        benefits: [
          "One-click deployment to Twilio Studio",
          "Seamless call handling and forwarding",
          "Automatic speech recognition integration",
        ],
      },
      {
        name: "FreeSWITCH",
        description:
          "Open-source voice platform integration for complete customization",
        logo: "https://cdn.brandfetch.io/idIZAsYHIa/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
        benefits: [
          "Self-hosted voice solution",
          "Complete call flow customization",
          "Advanced IVR capabilities",
        ],
      },
    ],
  },
  {
    id: "web",
    title: "Web Framework Support",
    description:
      "Integrate our conversational AI directly into your web applications",
    icon: <Globe />,
    items: [
      {
        name: "React",
        description:
          "Drop-in components for any React application with minimal configuration",
        logo: "/logos/react.svg",
        benefits: [
          "Styled and unstyled component options",
          "Redux integration helpers",
          "Works with React 16+ and React 18",
        ],
      },
      {
        name: "Next.js",
        description:
          "Optimized integration with Next.js for server-side and static applications",
        logo: "/logos/nextjs.svg",
        benefits: [
          "App Router and Pages Router support",
          "Server component compatibility",
          "Edge runtime compatible",
        ],
      },
      {
        name: "Other Frameworks",
        description:
          "Compatible with Angular, Vue, and other modern web frameworks",
        logo: "/logos/frameworks.svg",
        benefits: [
          "Vanilla JavaScript library available",
          "TypeScript definitions included",
          "Framework-agnostic REST API",
        ],
      },
    ],
  },
  {
    id: "messaging",
    title: "Messaging Platforms",
    description:
      "Deploy AI agents across popular messaging channels to engage customers",
    icon: <MessageCircle />,
    items: [
      {
        name: "SMS",
        description:
          "Text message integration for direct customer communication",
        logo: "/logos/sms.svg",
        benefits: [
          "Two-way SMS conversations",
          "Automated appointment reminders",
          "Message scheduling capabilities",
        ],
      },
      {
        name: "WhatsApp",
        description:
          "Connect with customers on the world's most popular messaging platform",
        logo: "/logos/whatsapp.svg",
        benefits: [
          "Rich media message support",
          "WhatsApp Business API integration",
          "Template message management",
        ],
      },
      {
        name: "Web Chat",
        description: "Embeddable chat widgets for your website or application",
        logo: "/logos/webchat.svg",
        benefits: [
          "Fully customizable chat UI",
          "Visitor tracking and analytics",
          "Pre-chat forms and surveys",
        ],
      },
    ],
  },
];

export const TechnologiesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("telephony");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Handle item expansion
  const toggleItemExpansion = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <FuturisticBackground />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-block mb-5 px-5 py-2 rounded-full"
            style={{
              background: `${ThemeColors.accent}15`,
              border: `1px solid ${ThemeColors.accent}30`,
            }}
          >
            <span style={{ color: ThemeColors.accent }} className="font-medium">
              Versatile Integration
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl font-bold mb-6 tracking-tight text-text dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Supported{" "}
            <span style={{ color: ThemeColors.accent }}>Technologies</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Integrate Conversate into your existing infrastructure with our wide
            range of supported platforms and technologies
          </motion.p>
        </div>

        {/* Category Selection Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-5 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {technologies.map((category) => (
            <motion.button
              key={category.id}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                backgroundColor:
                  selectedCategory === category.id
                    ? ThemeColors.accent
                    : isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                border:
                  selectedCategory === category.id
                    ? "none"
                    : isDark
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(0,0,0,0.07)",
                color:
                  selectedCategory === category.id
                    ? "#FFFFFF"
                    : isDark
                    ? "#FFFFFF"
                    : "#111827",
                boxShadow:
                  selectedCategory === category.id
                    ? `0 8px 16px -2px ${ThemeColors.accent}40`
                    : "none",
              }}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{
                scale: 1.02,
                backgroundColor:
                  selectedCategory === category.id
                    ? ThemeColors.accent
                    : isDark
                    ? "rgba(255,255,255,0.09)"
                    : "rgba(0,0,0,0.06)",
                boxShadow:
                  selectedCategory === category.id
                    ? `0 8px 20px -2px ${ThemeColors.accent}50`
                    : `0 6px 12px -2px rgba(0,0,0,${isDark ? "0.2" : "0.08"})`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {category.icon}
              </span>
              <span>{category.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Selected Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            className="max-w-7xl mx-auto"
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {technologies.map(
              (category) =>
                category.id === selectedCategory && (
                  <div
                    key={category.id}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                  >
                    {/* Description Panel */}
                    <motion.div
                      className="lg:col-span-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="p-8 h-full"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          backgroundColor: isDark
                            ? "rgba(32, 32, 36, 0.85)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(16px)",
                          border: `1px solid ${ThemeColors.accent}${
                            isDark ? "33" : "20"
                          }`,
                          boxShadow: `0 25px 25px -12px rgba(0,0,0,${
                            isDark ? "0.25" : "0.1"
                          })`,
                        }}
                      >
                        <div
                          className="p-4 rounded-lg w-16 h-16 flex items-center justify-center mb-6"
                          style={{
                            backgroundColor: `${ThemeColors.accent}25`,
                            color: ThemeColors.accent,
                          }}
                        >
                          <div className="text-3xl">{category.icon}</div>
                        </div>

                        <h3 className="text-3xl font-bold mb-5 text-gray-900 dark:text-white">
                          {category.title}
                        </h3>

                        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">
                          {category.description}
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="p-1.5 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${ThemeColors.accent}15`,
                            }}
                          >
                            <Code
                              size={18}
                              style={{ color: ThemeColors.accent }}
                            />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200">
                            Easy integration with comprehensive documentation
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="p-1.5 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${ThemeColors.accent}15`,
                            }}
                          >
                            <Server
                              size={18}
                              style={{ color: ThemeColors.accent }}
                            />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200">
                            Full API access and developer support
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Technologies List */}
                    <motion.div
                      className="lg:col-span-2 flex flex-col gap-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {category.items.map((item, index) => (
                        <motion.div
                          key={item.name}
                          className="overflow-hidden"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                            backgroundColor: isDark
                              ? "rgba(32, 32, 36, 0.85)"
                              : "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(16px)",
                            border: `1px solid ${ThemeColors.accent}${
                              isDark ? "33" : "20"
                            }`,
                          }}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                          whileHover={{
                            y: -5,
                            boxShadow: `0 15px 30px -5px rgba(0, 0, 0, ${
                              isDark ? "0.4" : "0.15"
                            }), 0 0 20px ${ThemeColors.accent}${
                              isDark ? "30" : "20"
                            }`,
                          }}
                        >
                          <div className="p-7 flex gap-5 items-center">
                            {/* Logo Container */}
                            <div
                              className="w-16 h-16 shrink-0 flex items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.05)",
                                border: `1px solid ${
                                  isDark
                                    ? "rgba(255,255,255,0.15)"
                                    : "rgba(0,0,0,0.07)"
                                }`,
                              }}
                            >
                              <span
                                className="text-2xl font-bold"
                                style={{ color: ThemeColors.accent }}
                              >
                                {item.name.charAt(0)}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                                  {item.name}
                                </h4>

                                <motion.button
                                  style={{ color: ThemeColors.accent }}
                                  className="flex items-center gap-1.5 text-sm font-medium bg-accent/10 hover:bg-accent/15 px-3 py-1.5 rounded-md transition-colors"
                                  onClick={() => toggleItemExpansion(item.name)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  aria-expanded={expandedItem === item.name}
                                  aria-controls={`${item.name.toLowerCase()}-details`}
                                >
                                  <span>
                                    {expandedItem === item.name
                                      ? "Hide details"
                                      : "Show details"}
                                  </span>
                                  {expandedItem === item.name ? (
                                    <ChevronUp
                                      size={14}
                                      style={{ color: ThemeColors.accent }}
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={14}
                                      style={{ color: ThemeColors.accent }}
                                    />
                                  )}
                                </motion.button>
                              </div>

                              <p className="text-gray-700 dark:text-gray-200 mt-2">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Expandable Benefits Section */}
                          <AnimatePresence>
                            {expandedItem === item.name && item.benefits && (
                              <motion.div
                                id={`${item.name.toLowerCase()}-details`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                              >
                                <div className="px-7 pb-7 pt-2">
                                  <div
                                    className="w-full h-px mb-5"
                                    style={{
                                      background: `linear-gradient(90deg, ${ThemeColors.accent}30, transparent)`,
                                    }}
                                  />
                                  <h5 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                    <span
                                      className="w-4 h-4 rounded-full flex items-center justify-center"
                                      style={{
                                        backgroundColor: `${ThemeColors.accent}20`,
                                      }}
                                    >
                                      <Check
                                        size={10}
                                        style={{ color: ThemeColors.accent }}
                                        strokeWidth={3}
                                      />
                                    </span>
                                    <span>KEY BENEFITS</span>
                                  </h5>

                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {item.benefits.map((benefit, idx) => (
                                      <motion.li
                                        key={idx}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                      >
                                        <Check
                                          size={14}
                                          style={{ color: ThemeColors.accent }}
                                          className="shrink-0"
                                          strokeWidth={2.5}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">
                                          {benefit}
                                        </span>
                                      </motion.li>
                                    ))}
                                  </ul>

                                  <motion.a
                                    href={`/docs/integrations/${item.name.toLowerCase()}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold mt-6 px-4 py-2"
                                    style={{
                                      clipPath:
                                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                                      backgroundColor: `${ThemeColors.accent}15`,
                                      color: ThemeColors.accent,
                                    }}
                                    whileHover={{
                                      scale: 1.03,
                                      backgroundColor: `${ThemeColors.accent}25`,
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span>View Documentation</span>
                                    <ExternalLink size={14} />
                                  </motion.a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )
            )}
          </motion.div>
        </AnimatePresence>

        {/* Additional Info with more space */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Need a Custom Integration?
            </h4>
            <p className="text-gray-700 dark:text-gray-200 mb-8">
              Can&apos;t find your technology of choice? Our team can help with
              custom integrations tailored to your specific infrastructure
              requirements.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                backgroundColor: ThemeColors.accent,
                color: "white",
                boxShadow: `0 8px 16px -2px ${ThemeColors.accent}40`,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 12px 20px -2px ${ThemeColors.accent}60`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Contact for Custom Integration</span>
              <ExternalLink size={14} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
