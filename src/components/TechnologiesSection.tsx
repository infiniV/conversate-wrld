"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { PhoneCall, Globe, MessageCircle, Check } from "lucide-react";
import { TechnologicalBackground } from "./TechnologicalBackground";
import { companyLogos } from "./CompanyLogos";

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
        logo: "twilio", // Changed to use our custom SVG
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
        logo: "freeswitch",
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
        logo: "react",
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
        logo: "nextjs",
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
        logo: "frameworks",
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
        logo: "sms",
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
        logo: "whatsapp",
        benefits: [
          "Rich media message support",
          "WhatsApp Business API integration",
          "Template message management",
        ],
      },
      {
        name: "Web Chat",
        description: "Embeddable chat widgets for your website or application",
        logo: "webchat",
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
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-32">
      <TechnologicalBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div className="mb-20 text-center">
          <motion.div className="mb-4 flex items-center justify-center gap-2">
            <div
              className="h-[1px] w-12"
              style={{ backgroundColor: ThemeColors.accent }}
            />
            <Globe size={16} style={{ color: ThemeColors.accent }} />
            <div
              className="h-[1px] w-12"
              style={{ backgroundColor: ThemeColors.accent }}
            />
          </motion.div>

          <h2 className="mb-6 text-5xl font-bold tracking-tight">
            Integration{" "}
            <span style={{ color: ThemeColors.accent }}>Ecosystem</span>
          </h2>
          <p
            className={`mx-auto max-w-2xl text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Connect your existing infrastructure with our comprehensive platform
            support
          </p>
        </motion.div>

        {/* Updated Category Selection Tabs */}
        <div className="relative mb-16 flex justify-center">
          <div
            className="relative w-full max-w-2xl rounded-2xl p-1.5"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.05))"
                : "linear-gradient(to bottom, rgba(0,0,0,0.01), rgba(0,0,0,0.02))",
              backdropFilter: "blur(8px)",
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
            }}
          >
            {/* Accent line decoration */}
            <div
              className="absolute left-1/4 right-1/4 top-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}40, transparent)`,
              }}
            />

            <div className="grid grid-cols-3 gap-2">
              {technologies.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group relative flex flex-col items-center gap-2 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? `${ThemeColors.accent}08`
                        : "transparent",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedCategory === category.id && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        border: `1px solid ${ThemeColors.accent}40`,
                        background: `linear-gradient(135deg, ${ThemeColors.accent}15, ${ThemeColors.accent}05)`,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className="relative z-10 text-xl transition-colors duration-200"
                    style={{
                      color:
                        selectedCategory === category.id
                          ? ThemeColors.accent
                          : isDark
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.5)",
                    }}
                  >
                    {category.icon}
                  </span>
                  <span
                    className="relative z-10 text-sm font-medium transition-colors duration-200"
                    style={{
                      color:
                        selectedCategory === category.id
                          ? ThemeColors.accent
                          : isDark
                            ? "#fff"
                            : "#000",
                    }}
                  >
                    {category.title}
                  </span>

                  {/* Bottom accent line for active tab */}
                  {selectedCategory === category.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/4 right-1/4 h-[2px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Cards Grid - Refined */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technologies
            .find((cat) => cat.id === selectedCategory)
            ?.items.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group relative"
              >
                <div
                  className="relative p-6"
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
                  }}
                >
                  {/* Enhanced hover effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          ${ThemeColors.accent}05 0%, 
                          transparent 50%,
                          ${ThemeColors.accent}05 100%
                        )
                      `,
                      borderRadius: "inherit",
                    }}
                  />

                  {/* Logo and Title Section */}
                  <div className="relative z-10 mb-6 flex items-start gap-4 transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:transform">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: `${ThemeColors.accent}15`,
                        border: `1px solid ${ThemeColors.accent}20`,
                      }}
                    >
                      {companyLogos[item.logo] ?? (
                        <span
                          className="text-xl font-bold"
                          style={{ color: ThemeColors.accent }}
                        >
                          {item.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-text dark:text-darkText mb-1 text-lg font-bold">
                        {item.name}
                      </h3>
                      <p className="text-secondaryText dark:text-darkSecondaryText text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="mb-6 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, ${ThemeColors.accent}20, transparent)`,
                    }}
                  />

                  {/* Benefits List */}
                  <div className="space-y-3">
                    {item.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor: `${ThemeColors.accent}10`,
                            border: `1px solid ${ThemeColors.accent}20`,
                          }}
                        >
                          <Check
                            size={12}
                            style={{ color: ThemeColors.accent }}
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-secondaryText dark:text-darkSecondaryText text-sm">
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Background glow effect */}
                <div
                  className="absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${ThemeColors.accent}15, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
