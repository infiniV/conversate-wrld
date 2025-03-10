"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "~/components/ThemeConstants";
import {
  LayoutDashboard,
  Settings,
  UserCircle2,
  Puzzle,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle2 },
  { name: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Animated border component with moving lines
const AnimatedBorder = ({
  position,
}: {
  position: "top" | "right" | "bottom" | "left";
}) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const getAnimationProps = () => {
    switch (position) {
      case "top":
        return {
          x: ["-100%", "100%"],
          width: "40%",
          height: "1px",
          top: 0,
          left: 0,
        };
      case "right":
        return {
          y: ["-100%", "100%"],
          width: "1px",
          height: "40%",
          top: 0,
          right: 0,
        };
      case "bottom":
        return {
          x: ["100%", "-100%"],
          width: "60%",
          height: "1px",
          bottom: 0,
          right: 0,
        };
      case "left":
        return {
          y: ["100%", "-100%"],
          width: "1px",
          height: "30%",
          bottom: 0,
          left: 0,
        };
      default:
        return {};
    }
  };

  const { x, y, width, height, ...positionProps } = getAnimationProps();

  return (
    <motion.div
      className="absolute"
      style={{
        width,
        height,
        ...positionProps,
        background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}${isDark ? "40" : "30"}, transparent)`,
      }}
      animate={{ x, y }}
      transition={{
        duration: position === "top" || position === "bottom" ? 8 : 6,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
    />
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="flex min-h-screen p-6">
      {/* Sidebar Container */}
      <div className="relative h-[calc(100vh-48px)] w-72">
        {/* Main Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 flex h-full w-full flex-col gap-2 p-4"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
            backgroundColor: isDark
              ? `${ThemeColors.dark.subtleUI}90`
              : `${ThemeColors.light.subtleUI}DD`,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Content */}
          {/* Animated borders */}
          <AnimatedBorder position="top" />
          <AnimatedBorder position="right" />
          <AnimatedBorder position="bottom" />
          <AnimatedBorder position="left" />

          {/* Logo */}
          <div className="relative z-10 mb-8 px-3 py-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: `${ThemeColors.accent}20`,
                  color: ThemeColors.accent,
                }}
              >
                C
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold"
                  style={{ color: ThemeColors.accent }}
                >
                  Conversate
                </span>
                <div className="flex items-center">
                  <motion.div
                    className="h-[1px] w-full"
                    style={{
                      backgroundColor: ThemeColors.accent,
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
                <motion.span
                  className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em]"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  style={{
                    color: isDark
                      ? ThemeColors.dark.secondaryText
                      : ThemeColors.light.secondaryText,
                  }}
                >
                  AI Customer Care
                </motion.span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="relative z-10 flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="relative flex items-center gap-3 px-3 py-2"
                    style={{
                      color: isActive
                        ? ThemeColors.accent
                        : isDark
                          ? ThemeColors.dark.secondaryText
                          : ThemeColors.light.secondaryText,
                    }}
                    whileHover={{
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      y: -1,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0"
                        style={{
                          backgroundColor: `${ThemeColors.accent}10`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <div
                      className={`flex h-8 w-8 items-center justify-center transition-colors`}
                      style={{
                        backgroundColor: isActive
                          ? `${ThemeColors.accent}15`
                          : "transparent",
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="relative z-10 text-sm font-medium">
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div
            className="relative z-10 mt-auto pt-4"
            style={{
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            <motion.button
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 px-3 py-2"
              style={{
                color: isDark
                  ? ThemeColors.dark.secondaryText
                  : ThemeColors.light.secondaryText,
              }}
              whileHover={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                y: -1,
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex-1 px-6"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
