"use client";

import { motion } from "framer-motion";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { FuturisticSideLightBackground } from "./FuturisticSideLightBackground";
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const PricingSection = () => {
  const { theme, systemTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only use theme after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted && currentTheme === "dark";
  const isStandalonePricingPage = pathname === "/pricing";

  const { data: onboardingStatus } =
    api.onboarding.getOnboardingStatus.useQuery(undefined, {
      // Don't show loading state if we're just revalidating
      refetchOnWindowFocus: false,
    });

  const createSubscription = api.onboarding.createSubscription.useMutation({
    onSuccess: () => {
      router.push("/onboarding/business-profile");
    },
  });

  // If user is already onboarded, redirect them to the dashboard
  useEffect(() => {
    if (onboardingStatus?.isComplete) {
      router.push("/dashboard");
    }
  }, [onboardingStatus, router]);

  const handlePlanSelection = async (planId: string) => {
    try {
      await createSubscription.mutateAsync({
        planId,
        // In a real implementation, we would handle payment here
        paymentToken: "dummy_token",
      });
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const plans = [
    {
      id: "starter",
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
      id: "professional",
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
      id: "enterprise",
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
    <section
      className={`relative overflow-hidden bg-transparent px-4 ${isStandalonePricingPage ? "pt-16" : "py-32"}`}
    >
      <FuturisticSideLightBackground side="both" intensity={0.6} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Add decorative element above title */}
          <motion.div
            className="mb-4 flex items-center justify-center gap-2"
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

          <h2 className="mb-6 text-5xl font-bold tracking-tight">
            Simple, Transparent <span className="text-[#FF3D71]">Pricing</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 transition-colors duration-200">
            Choose the perfect plan for your business needs. Scale your customer
            service with our intelligent solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                className={`group relative h-full p-8 transition-all duration-300 ${
                  mounted && isDark
                    ? "bg-[rgba(255,255,255,0.02)]"
                    : "bg-[rgba(0,0,0,0.01)]"
                }`}
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  border: `1px solid ${
                    plan.popular
                      ? ThemeColors.accent
                      : mounted && isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)"
                  }`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Rest of the code remains the same */}
                {/* Add hover glow effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${ThemeColors.accent}10, transparent 70%)`,
                    }}
                  />
                </div>

                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 mt-1 -translate-x-1/2"
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

                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-gray-600 transition-colors duration-200">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 transition-colors duration-200">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 space-y-4">
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
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
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
                      <span className="text-sm text-gray-600 transition-colors duration-200">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className="flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors duration-200"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    backgroundColor: plan.popular
                      ? ThemeColors.accent
                      : "transparent",
                    border: plan.popular ? "none" : "1px solid rgba(0,0,0,0.1)",
                    color: plan.popular ? "white" : "#111827",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    plan.name === "Enterprise"
                      ? router.push("/contact-sales")
                      : handlePlanSelection(plan.id)
                  }
                  disabled={createSubscription.status === "pending"}
                >
                  <span className="tracking-wide">
                    {createSubscription.status === "pending"
                      ? "Processing..."
                      : plan.name === "Enterprise"
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
