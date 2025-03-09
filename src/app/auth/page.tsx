"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ThemeColors } from "~/components/ThemeConstants";
import { useTheme } from "next-themes";
import { Github, ArrowRight } from "lucide-react";
import { AuthBackground } from "~/components/AuthBackground";
import { useState, useEffect } from "react";

export default function AuthPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-gradient mb-3 bg-clip-text text-4xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-secondaryText dark:text-darkSecondaryText">
            Continue with your GitHub account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
            backgroundColor: isDark
              ? "rgba(24, 24, 27, 0.7)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
          }}
          className="p-8"
        >
          <motion.button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 1 }}
            className="relative flex w-full items-center justify-center gap-3 overflow-hidden p-3"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              backgroundColor: isDark ? "#24292e" : "#ffffff",
              border: `1px solid ${isDark ? "#ffffff20" : "#00000020"}`,
            }}
          >
            {/* Button background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `linear-gradient(${
                  isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
                } 1px, transparent 1px), linear-gradient(90deg, ${
                  isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
                } 1px, transparent 1px)`,
                backgroundSize: "8px 8px",
              }}
            />

            <Github size={20} />
            <span className="font-medium">Continue with GitHub</span>
            <motion.div
              className="absolute right-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.button>

          <div className="relative mt-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div
                className="w-full"
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${
                    ThemeColors.accent
                  }${isDark ? "40" : "30"}, transparent)`,
                }}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(24, 24, 27, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                }}
              >
                <span className="text-secondaryText dark:text-darkSecondaryText">
                  Protected by
                </span>{" "}
                <span
                  style={{ color: ThemeColors.accent }}
                  className="font-semibold"
                >
                  Conversate
                </span>
              </span>
            </div>
          </div>

          <p className="text-secondaryText dark:text-darkSecondaryText mt-6 text-center text-sm">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-accent hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
