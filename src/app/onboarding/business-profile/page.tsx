"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { FuturisticBackground } from "~/components/FuturisticBackground";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { ThemeColors } from "~/components/ThemeConstants";
import { useTheme } from "next-themes";

export default function BusinessProfileOnboarding() {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    description: "",
    useCase: "",
    websiteUrl: "",
  });

  // Fetch subscription details to display the selected plan
  const { data: subscription } = api.onboarding.getSubscription.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const createProfile = api.onboarding.createBusinessProfile.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile.mutateAsync(formData);
    } catch (error) {
      console.error("Failed to create business profile:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const planFeatures = {
    starter: [
      "AI Customer Service (8AM-5PM)",
      "Text Message Support",
      "Basic Chat Widget",
      "Up to 500 conversations/month",
      "Basic Analytics Dashboard",
      "2 Custom AI Training Scenarios",
    ],
    professional: [
      "24/7 AI Customer Service",
      "Text + Voice Call Support",
      "Advanced Chat Widget",
      "Up to 2000 conversations/month",
      "Advanced Analytics & Reporting",
      "10 Custom AI Training Scenarios",
      "Multi-language Support",
      "Priority Queue Management",
    ],
    enterprise: [
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
  };

  // Get features based on the selected plan
  const selectedPlanFeatures = subscription?.planId
    ? planFeatures[subscription.planId as keyof typeof planFeatures] || []
    : [];

  // Get plan name for display
  const getPlanName = () => {
    switch (subscription?.planId) {
      case "starter":
        return "Starter";
      case "professional":
        return "Professional";
      case "enterprise":
        return "Enterprise";
      default:
        return "Unknown";
    }
  };

  // Get plan price for display
  const getPlanPrice = () => {
    switch (subscription?.planId) {
      case "starter":
        return "$99/month";
      case "professional":
        return "$299/month";
      case "enterprise":
        return "Custom pricing";
      default:
        return "";
    }
  };

  return (
    <section className="from-background to-subtleUI dark:from-darkBackground dark:to-darkSubtleUI relative min-h-screen bg-gradient-to-b">
      <FuturisticBackground />

      <div className="container relative z-10 mx-auto px-4 py-16">
        {/* Header section with refined styling */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          {/* Progress indicator with refined styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-12 max-w-xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${ThemeColors.accent}15`,
                  }}
                >
                  <CheckCircle size={16} className="text-[#FF3D71]" />
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Select Plan
                </span>
              </motion.div>

              <div
                className="h-[2px] w-16"
                style={{
                  background: `linear-gradient(to right, ${ThemeColors.accent}, ${ThemeColors.accent}20)`,
                }}
              />

              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: ThemeColors.accent,
                    backgroundColor: ThemeColors.accent,
                  }}
                >
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Business Profile
                </span>
              </motion.div>

              <div
                className="h-[2px] w-16"
                style={{
                  background: `linear-gradient(to right, ${ThemeColors.accent}20, transparent)`,
                }}
              />

              <motion.div
                className="flex items-center opacity-60"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${ThemeColors.accent}10`,
                  }}
                >
                  <Circle size={16} className="text-gray-400" />
                </div>
                <span className="text-text dark:text-darkText ml-2 text-sm font-medium">
                  Ready!
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ background: `${ThemeColors.accent}15` }}
            className="mb-3 inline-block rounded-full px-4 py-1.5"
          >
            <span className="font-medium text-accent">Almost There!</span>
          </motion.div>

          <motion.h1
            className="text-text dark:text-darkText mb-4 text-center text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tell Us About Your Business
          </motion.h1>

          <motion.p
            className="text-secondaryText dark:text-darkSecondaryText mx-auto max-w-2xl text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Help us customize your AI customer service experience by providing
            some details about your business
          </motion.p>
        </div>

        {/* Main content grid with refined styling */}
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Form section with refined styling */}
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields with enhanced styling */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {[
                    {
                      id: "businessName",
                      label: "Business Name",
                      type: "text",
                      placeholder: "Your Business Name",
                      required: true,
                    },
                    {
                      id: "industry",
                      label: "Industry",
                      type: "text",
                      placeholder: "e.g., E-commerce, SaaS, Healthcare",
                      required: true,
                    },
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <label
                        htmlFor={field.id}
                        className="text-text dark:text-darkText mb-2 block text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full rounded-lg border bg-black/10 p-3 focus:border-transparent focus:ring-2 focus:ring-[#FF3D71]"
                        style={{
                          borderColor: `${ThemeColors.accent}20`,
                        }}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}

                  {/* Textarea fields with enhanced styling */}
                  {[
                    {
                      id: "description",
                      label: "Business Description",
                      placeholder:
                        "Tell us about your business and what you do",
                      required: true,
                    },
                    {
                      id: "useCase",
                      label: "How will you use Conversate?",
                      placeholder:
                        "Describe your customer service needs and how you plan to use our AI",
                      required: true,
                    },
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <label
                        htmlFor={field.id}
                        className="text-text dark:text-darkText mb-2 block text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        required={field.required}
                        rows={4}
                        className="w-full rounded-lg border bg-black/10 p-3 focus:border-transparent focus:ring-2 focus:ring-[#FF3D71]"
                        style={{
                          borderColor: `${ThemeColors.accent}20`,
                        }}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}

                  {/* Website URL field with enhanced styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      htmlFor="websiteUrl"
                      className="text-text dark:text-darkText mb-2 block text-sm font-medium"
                    >
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="w-full rounded-lg border bg-black/10 p-3 focus:border-transparent focus:ring-2 focus:ring-[#FF3D71]"
                      style={{
                        borderColor: `${ThemeColors.accent}20`,
                      }}
                      placeholder="https://your-business.com"
                    />
                  </motion.div>
                </motion.div>

                <motion.button
                  type="submit"
                  className="group w-full rounded-lg px-6 py-3 font-semibold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${ThemeColors.accent}, ${ThemeColors.accent}dd)`,
                  }}
                  disabled={createProfile.status === "pending"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    {createProfile.status === "pending" ? (
                      "Creating Profile..."
                    ) : (
                      <>
                        Complete Setup
                        <ChevronRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>

            {/* Plan summary card with enhanced styling */}
            <motion.div
              className="sticky top-6 h-fit rounded-lg border p-6"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                backdropFilter: "blur(12px)",
                backgroundColor: isDark
                  ? "rgba(24, 24, 27, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
                boxShadow: `0 10px 25px -5px rgba(0, 0, 0, ${isDark ? "0.3" : "0.1"}), 
                           0 4px 10px rgba(0, 0, 0, 0.04),
                           0 0 20px ${ThemeColors.accent}${isDark ? "30" : "20"}`,
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-text dark:text-darkText mb-4 text-xl font-bold">
                Your Selected Plan
              </h3>

              <div className="mb-2">
                <span className="text-secondaryText dark:text-darkSecondaryText text-sm">
                  Plan:
                </span>
                <div
                  className="text-2xl font-bold"
                  style={{ color: ThemeColors.accent }}
                >
                  {getPlanName()}
                </div>
                <div className="text-text dark:text-darkText text-sm font-medium">
                  {getPlanPrice()}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-[3px] w-[16px]"
                    style={{ backgroundColor: ThemeColors.accent }}
                  />
                  <h4 className="text-text dark:text-darkText font-semibold">
                    Plan Features
                  </h4>
                </div>
                <ul className="space-y-2">
                  {selectedPlanFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="text-secondaryText dark:text-darkSecondaryText flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <div
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${ThemeColors.accent}15`,
                        }}
                      >
                        <CheckCircle
                          size={10}
                          style={{ color: ThemeColors.accent }}
                          strokeWidth={3}
                        />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-6 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${ThemeColors.accent}10`,
                }}
              >
                <p className="text-secondaryText dark:text-darkSecondaryText">
                  You can always upgrade or change your plan later from your
                  dashboard.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
