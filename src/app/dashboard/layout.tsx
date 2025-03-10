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
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: isDark
          ? ThemeColors.dark.background
          : ThemeColors.light.background,
      }}
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex w-64 flex-col gap-2 border-r p-4"
        style={{
          backgroundColor: isDark
            ? ThemeColors.dark.subtleUI
            : ThemeColors.light.subtleUI,
          borderColor: isDark
            ? ThemeColors.dark.border
            : ThemeColors.light.border,
          backdropFilter: "blur(16px)",
          boxShadow: `0 0 30px ${ThemeColors.accent}10`,
        }}
      >
        {/* Accent line decoration */}
        <div
          className="absolute inset-y-0 left-0 w-[1px]"
          style={{
            background: `linear-gradient(to bottom, transparent, ${ThemeColors.accent}40, transparent)`,
          }}
        />

        {/* Logo */}
        <div className="mb-8 px-3 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: `${ThemeColors.accent}15`,
                color: ThemeColors.accent,
                clipPath: ThemeColors.polygons.sm,
              }}
            >
              C
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: ThemeColors.accent }}
            >
              Conversate
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="relative flex items-center gap-3 px-3 py-2"
                  style={{
                    clipPath: ThemeColors.polygons.sm,
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
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `${ThemeColors.accent}08`,
                        border: `1px solid ${ThemeColors.accent}40`,
                        clipPath: ThemeColors.polygons.sm,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors`}
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
          className="mt-auto border-t pt-4"
          style={{
            borderColor: isDark
              ? ThemeColors.dark.border
              : ThemeColors.light.border,
          }}
        >
          <motion.button
            className="flex w-full items-center gap-3 px-3 py-2"
            style={{
              clipPath: ThemeColors.polygons.sm,
              color: isDark
                ? ThemeColors.dark.secondaryText
                : ThemeColors.light.secondaryText,
            }}
            whileHover={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>

        {/* Bottom decoration */}
        <div
          className="absolute bottom-0 left-1/4 right-1/4 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}20, transparent)`,
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
}
