"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import {
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { FooterBackground } from "./FooterBackground";

// Define polygon clip paths
const POLYGON_CLIP_PATHS = {
  sm: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
  md: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
  lg: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
};

export const FooterSection = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const links = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" },
      { name: "Status", href: "/status" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const subscribeHighlights = [
    "Weekly product updates",
    "Industry news and insights",
    "Customer success stories",
  ];

  return (
    <footer
      className="relative pt-20 pb-10"
      style={{
        backgroundColor: isDark
          ? ThemeColors.dark.background
          : ThemeColors.light.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Polygonic background */}
      <FooterBackground />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div
            style={{
              clipPath: POLYGON_CLIP_PATHS.lg, // Use the direct reference
              background: isDark
                ? "rgba(24, 24, 27, 0.7)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
              padding: "2.5rem",
            }}
          >
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: isDark
                      ? ThemeColors.dark.text
                      : ThemeColors.light.text,
                  }}
                >
                  Stay Updated with Conversate
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText,
                    marginBottom: "1.5rem",
                  }}
                >
                  Subscribe to our newsletter for the latest updates, industry
                  insights, and exclusive content.
                </motion.p>

                <div className="space-y-3">
                  {subscribeHighlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                    >
                      <CheckCircle
                        size={16}
                        style={{ color: ThemeColors.accent }}
                      />
                      <span
                        style={{
                          color: isDark
                            ? ThemeColors.dark.secondaryText
                            : ThemeColors.light.secondaryText,
                          fontSize: "0.875rem",
                        }}
                      >
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.input
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                      }`,
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                      color: isDark
                        ? ThemeColors.dark.text
                        : ThemeColors.light.text,
                      flex: "1",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  />
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      clipPath: POLYGON_CLIP_PATHS.sm, // Use the direct reference
                      backgroundColor: ThemeColors.accent,
                      color: "white",
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>Subscribe</span>
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  style={{
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                    fontSize: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  We respect your privacy. Unsubscribe at any time.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-16">
          {/* Brand Column */}
          <motion.div
            className="col-span-2 md:col-span-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  padding: "0.625rem",
                  clipPath: POLYGON_CLIP_PATHS.sm, // Use the direct reference
                  backgroundColor: `${ThemeColors.accent}15`,
                  border: `1px solid ${ThemeColors.accent}20`,
                }}
              >
                <MessageSquare
                  size={20}
                  style={{ color: ThemeColors.accent }}
                  strokeWidth={2.5}
                />
              </div>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  background: isDark
                    ? `linear-gradient(90deg, ${ThemeColors.dark.text}, ${ThemeColors.dark.secondaryText})`
                    : `linear-gradient(90deg, ${ThemeColors.light.text}, ${ThemeColors.light.secondaryText})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Conversate
              </span>
            </div>

            <p
              style={{
                color: isDark
                  ? ThemeColors.dark.secondaryText
                  : ThemeColors.light.secondaryText,
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
              }}
            >
              Building the future of customer service with intelligent
              conversation technology.
            </p>

            {/* Social Links Row */}
            <div className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "0.375rem",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    color: isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${ThemeColors.accent}20`;
                    e.currentTarget.style.color = ThemeColors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)";
                    e.currentTarget.style.color = isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText;
                  }}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(links).map(([section, items], sectionIndex) => (
            <motion.div
              key={section}
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
            >
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: ThemeColors.accent,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h3>

              <ul className="space-y-2">
                {items.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2 + 0.05 * linkIndex,
                    }}
                  >
                    <a
                      href={link.href}
                      style={{
                        fontSize: "0.875rem",
                        color: isDark
                          ? ThemeColors.dark.secondaryText
                          : ThemeColors.light.secondaryText,
                        transition: "all 0.2s ease",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = ThemeColors.accent;
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isDark
                          ? ThemeColors.dark.secondaryText
                          : ThemeColors.light.secondaryText;
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-6 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${
                ThemeColors.accent
              }${isDark ? "40" : "30"}, transparent)`,
            }}
          />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              style={{
                fontSize: "0.75rem",
                color: isDark
                  ? `${ThemeColors.dark.secondaryText}99`
                  : `${ThemeColors.light.secondaryText}99`,
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
              className="md:text-left md:mb-0"
            >
              &copy; {new Date().getFullYear()} Conversate AI. All rights
              reserved.
            </p>

            <div className="flex gap-4">
              <a
                href="/privacy"
                style={{
                  fontSize: "0.75rem",
                  color: isDark
                    ? ThemeColors.dark.secondaryText
                    : ThemeColors.light.secondaryText,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ThemeColors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark
                    ? ThemeColors.dark.secondaryText
                    : ThemeColors.light.secondaryText;
                }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                style={{
                  fontSize: "0.75rem",
                  color: isDark
                    ? ThemeColors.dark.secondaryText
                    : ThemeColors.light.secondaryText,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ThemeColors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark
                    ? ThemeColors.dark.secondaryText
                    : ThemeColors.light.secondaryText;
                }}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
