"use client";

import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { FuturisticSideLightBackground } from "./FuturisticSideLightBackground";

export const PricingSection = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "AI Customer Service (8AM-5PM)",
        "Text Message Support",
        "Basic Chat Widget",
        "Up to 500 conversations/month",
        "Basic Analytics Dashboard",
        "2 Custom AI Training Scenarios",
      ],
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "24/7 AI Customer Service",
        "Text + Voice Call Support",
        "Advanced Chat Widget",
        "Up to 2000 conversations/month",
        "Advanced Analytics & Reporting",
        "10 Custom AI Training Scenarios",
        "Multi-language Support",
        "Priority Queue Management",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale operations",
      features: [
        "24/7 AI Customer Service",
        "All Communication Channels",
        "Custom-branded Interface",
        "Unlimited conversations",
        "Enterprise Analytics Suite",
        "Unlimited AI Training Scenarios",
        "Multi-location Support",
        "Dedicated Account Manager",
        "Custom Integration Options",
        "SLA Guarantees",
      ],
    },
  ];

  return (
    <section className="bg-transparent py-32 px-4 relative overflow-hidden">
      {/* Add the PricingSectionBackground for stars */}
      <FuturisticSideLightBackground side="both" intensity={0.6} />

      <div className="max-w-7xl mx-auto relative z-10">
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
            <Sparkles size={16} className="text-[#FF3D71]" />
            <div
              className="h-[1px] w-12"
              style={{ backgroundColor: ThemeColors.accent }}
            />
          </motion.div>

          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            Simple, Transparent <span className="text-[#FF3D71]">Pricing</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose the perfect plan for your business needs. Scale your customer
            service with our intelligent solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`h-full  relative p-8 group transition-all duration-300 ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.02)]"
                    : "bg-[rgba(0,0,0,0.01)]"
                }`}
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  border: `1px solid ${
                    plan.popular
                      ? ThemeColors.accent
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)"
                  }`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Rest of the code remains the same */}
                {/* Add hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${ThemeColors.accent}10, transparent 70%)`,
                    }}
                  />
                </div>

                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 mt-1"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div
                      className="px-4 py-1.5 text-xs font-semibold"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        backgroundColor: ThemeColors.accent,
                        boxShadow: `0 0 20px ${ThemeColors.accent}4D`,
                      }}
                    >
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex justify-center items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={`ml-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{
                          backgroundColor: `${ThemeColors.accent}15`,
                        }}
                      >
                        <Check
                          size={12}
                          className="text-[#FF3D71]"
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-6 py-4"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    backgroundColor: plan.popular
                      ? ThemeColors.accent
                      : "transparent",
                    border: plan.popular
                      ? "none"
                      : isDark
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(0,0,0,0.1)",
                    color: plan.popular
                      ? "white"
                      : isDark
                      ? "#FFFFFF"
                      : "#111827",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="tracking-wide">
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
