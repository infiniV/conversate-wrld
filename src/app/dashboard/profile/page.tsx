"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "~/components/ThemeConstants";
import {
  Edit,
  Users2,
  Mail,
  Phone,
  Globe,
  Activity,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

// Types
interface OrganizationData {
  name: string;
  plan: string;
  industry: string;
  size: string;
  website: string;
  email: string;
  phone: string;
}

interface IntegrationEvent {
  id: number;
  type: string;
  action: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

interface UsageStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

const organizationData: OrganizationData = {
  name: "Acme Corporation",
  plan: "Professional",
  industry: "Technology",
  size: "50-100 employees",
  website: "https://acme.example.com",
  email: "support@acme.example.com",
  phone: "+1 (555) 123-4567",
};

const integrationHistory: IntegrationEvent[] = [
  {
    id: 1,
    type: "Agent Server",
    action: "Configuration Updated",
    timestamp: "2024-01-15 14:30:00",
    status: "success",
  },
  {
    id: 2,
    type: "Voice Integration",
    action: "New Provider Added",
    timestamp: "2024-01-14 09:15:00",
    status: "success",
  },
  {
    id: 3,
    type: "Communication Server",
    action: "API Key Rotated",
    timestamp: "2024-01-13 16:45:00",
    status: "success",
  },
];

const usageStats: UsageStat[] = [
  {
    label: "Monthly Active Users",
    value: "2,847",
    change: "+12.5%",
    positive: true,
  },
  {
    label: "Response Rate",
    value: "98.2%",
    change: "+3.1%",
    positive: true,
  },
  {
    label: "Avg. Resolution Time",
    value: "4m 12s",
    change: "-8.5%",
    positive: true,
  },
];

const OrganizationProfile = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="p-6"
        style={{
          clipPath: ThemeColors.polygons.md,
          backgroundColor: isDark
            ? "rgba(24, 24, 27, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
        }}
      >
        {/* Header with avatar and edit button */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: `${ThemeColors.accent}15`,
                color: ThemeColors.accent,
                clipPath: ThemeColors.polygons.sm,
              }}
            >
              {organizationData.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {organizationData.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${ThemeColors.accent}15`,
                    color: ThemeColors.accent,
                    clipPath: ThemeColors.polygons.sm,
                  }}
                >
                  {organizationData.plan}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {organizationData.industry}
                </span>
              </div>
            </div>
          </div>
          <motion.button
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              clipPath: ThemeColors.polygons.sm,
              border: `1px solid ${ThemeColors.accent}40`,
              color: ThemeColors.accent,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit size={14} />
            <span className="text-xs font-medium">Edit Profile</span>
          </motion.button>
        </div>

        {/* Organization details and stats grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Organization details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {organizationData.size}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-400" />
              <a
                href={organizationData.website}
                className="text-sm text-accent hover:underline"
              >
                {organizationData.website}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {organizationData.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {organizationData.phone}
              </span>
            </div>
          </div>

          {/* Usage stats */}
          <div
            className="p-4"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
              clipPath: ThemeColors.polygons.sm,
            }}
          >
            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
              Usage Statistics
            </h4>
            <div className="space-y-4">
              {usageStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        stat.positive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const IntegrationHistory = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="p-6"
        style={{
          clipPath: ThemeColors.polygons.md,
          backgroundColor: isDark
            ? "rgba(24, 24, 27, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{
              backgroundColor: `${ThemeColors.accent}15`,
            }}
          >
            <Activity
              className="h-5 w-5"
              style={{ color: ThemeColors.accent }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Integration History
          </h3>
        </div>

        <div className="space-y-4">
          {integrationHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3"
              style={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                clipPath: ThemeColors.polygons.sm,
              }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.type}
                    </h4>
                    <span
                      className="text-xs"
                      style={{ color: ThemeColors.accent }}
                    >
                      {item.action}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.timestamp}
                  </p>
                </div>
              </div>
              <motion.button
                className="p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUpRight
                  className="h-4 w-4"
                  style={{ color: ThemeColors.accent }}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function ProfilePage() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="relative min-h-screen py-8">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${
            isDark ? "rgba(9,9,11,0.9)" : "rgba(250,250,250,0.9)"
          }, ${isDark ? "rgba(24,24,27,0.9)" : "rgba(243,244,246,0.9)"})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8">
        <div className="flex flex-col gap-8">
          {/* Header section */}
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              Organization Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your organization details and view integration history
            </p>
          </div>

          {/* Profile Content */}
          <OrganizationProfile />

          {/* Integration History */}
          <IntegrationHistory />
        </div>
      </div>
    </div>
  );
}
