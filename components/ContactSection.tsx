"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { FuturisticContactBackground } from "./FuturisticContactBackground";

export const ContactSection = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section
      className="bg-transparent py-32 px-4 relative overflow-hidden"
      id="contact"
    >
      {/* Add the background component */}
      <FuturisticContactBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Vertex Separator */}
        <motion.div
          className="w-full flex justify-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <svg
            width="320"
            height="40"
            viewBox="0 0 320 40"
            className="overflow-visible"
          >
            {/* Connected Vertices */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Connection Lines */}
              <motion.line
                x1="40"
                y1="20"
                x2="90"
                y2="10"
                stroke={ThemeColors.accent}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <motion.line
                x1="90"
                y1="10"
                x2="160"
                y2="30"
                stroke={ThemeColors.accent}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="160"
                y1="30"
                x2="230"
                y2="5"
                stroke={ThemeColors.accent}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <motion.line
                x1="230"
                y1="5"
                x2="280"
                y2="20"
                stroke={ThemeColors.accent}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              />
              <motion.line
                x1="160"
                y1="30"
                x2="160"
                y2="5"
                stroke={ThemeColors.accent}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.0 }}
              />

              {/* Vertex Points */}
              {[
                { x: 40, y: 20, delay: 0.2 },
                { x: 90, y: 10, delay: 0.4 },
                { x: 160, y: 30, delay: 0.6 },
                { x: 230, y: 5, delay: 0.8 },
                { x: 280, y: 20, delay: 1.0 },
                { x: 160, y: 5, delay: 1.2, special: true },
              ].map((point, index) => (
                <motion.g key={index}>
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={point.special ? 2.5 : 2}
                    fill={
                      point.special
                        ? ThemeColors.secondaryAccents.amber
                        : ThemeColors.accent
                    }
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: point.delay }}
                  />
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={point.special ? 8 : 6}
                    fill="transparent"
                    stroke={
                      point.special
                        ? ThemeColors.secondaryAccents.amber
                        : ThemeColors.accent
                    }
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      opacity: [0, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: point.delay,
                      repeat: point.special ? Infinity : 0,
                      repeatType: "reverse",
                      repeatDelay: point.special ? 2 : 0,
                    }}
                  />
                </motion.g>
              ))}
            </motion.g>
          </svg>
        </motion.div>

        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Add decorative element above title */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="h-[1px] w-12"
              style={{ backgroundColor: ThemeColors.accent }}
            />
            <MessageSquare size={16} className="text-[#FF3D71]" />
            <div
              className="h-[1px] w-12"
              style={{ backgroundColor: ThemeColors.accent }}
            />
          </motion.div>

          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            Get in <span className="text-[#FF3D71]">Touch</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Have questions about our platform? Ready to elevate your
            conversations? Let&apos;s connect and explore how we can help you
            transform your communication.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 group transition-all duration-300"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }`,
                backdropFilter: "blur(12px)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
              }}
            >
              {/* Add hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${ThemeColors.accent}10, transparent 70%)`,
                  }}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-md focus:ring-accent focus:border-accent ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.03)] border-gray-700 text-white"
                        : "bg-[rgba(0,0,0,0.02)] border-gray-300 text-gray-900"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-md focus:ring-accent focus:border-accent ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.03)] border-gray-700 text-white"
                        : "bg-[rgba(0,0,0,0.02)] border-gray-300 text-gray-900"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-md focus:ring-accent focus:border-accent ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.03)] border-gray-700 text-white"
                        : "bg-[rgba(0,0,0,0.02)] border-gray-300 text-gray-900"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-6 py-4"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    backgroundColor: isSubmitted
                      ? "#10B981"
                      : ThemeColors.accent,
                    color: "white",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="tracking-wide">
                    {isSubmitted ? "Message Sent!" : "Send Message"}
                  </span>
                  <motion.div
                    animate={{
                      x: isSubmitted ? 0 : [0, 4, 0],
                      rotate: isSubmitted ? [0, 360] : 0,
                      scale: isSubmitted ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: isSubmitted ? 0.5 : 1.5,
                      repeat: isSubmitted ? 0 : Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    {isSubmitted ? <Sparkles size={16} /> : <Send size={16} />}
                  </motion.div>
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-8"
          >
            {[
              {
                title: "Our Location",
                content: (
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    123 Innovation Way, Tech District
                    <br />
                    San Francisco, CA 94107
                  </p>
                ),
              },
              {
                title: "Contact Info",
                content: (
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    support@conversate.ai
                    <br />
                    +1 (555) 123-4567
                  </p>
                ),
              },
              {
                title: "Connect",
                content: (
                  <div className="flex space-x-4">
                    {["Twitter", "LinkedIn", "GitHub", "Discord"].map(
                      (platform) => (
                        <motion.a
                          key={platform}
                          href="#"
                          className="text-accent hover:text-white transition duration-300"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {platform}
                        </motion.a>
                      )
                    )}
                  </div>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="group transition-all duration-300 p-8"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  border: `1px solid ${
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                  }`,
                  backdropFilter: "blur(12px)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Add hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${ThemeColors.accent}10, transparent 70%)`,
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                {item.content}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
