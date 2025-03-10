"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "~/components/ThemeConstants";
import {
  Phone,
  MessageSquare,
  Server,
  Globe,
  Plus,
  AlertCircle,
  CheckCircle2,
  Settings2,
  Terminal,
  FileCode,
  type LucideIcon,
} from "lucide-react";

// Types
interface HealthCheck {
  name: string;
  value: string;
  status: "healthy" | "warning";
}

interface Usage {
  current: number;
  limit: number;
  unit: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: "active";
  provider: string;
  usage: Usage;
  healthChecks: HealthCheck[];
}

interface AvailableIntegration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: "available";
  category: string;
}

interface IntegrationCardProps {
  integration: Integration;
}

interface AvailableIntegrationCardProps {
  integration: AvailableIntegration;
}

// Dummy integration data
const integrations: Integration[] = [
  {
    id: "voice",
    name: "Voice System",
    description: "Manage voice call routing and handling",
    icon: Phone,
    status: "active",
    provider: "Twilio",
    usage: {
      current: 2847,
      limit: 5000,
      unit: "minutes",
    },
    healthChecks: [
      { name: "Latency", value: "45ms", status: "healthy" },
      { name: "Error Rate", value: "0.1%", status: "healthy" },
      { name: "Success Rate", value: "99.9%", status: "healthy" },
    ],
  },
  {
    id: "messaging",
    name: "Messaging System",
    description: "SMS and instant messaging integration",
    icon: MessageSquare,
    status: "active",
    provider: "Internal",
    usage: {
      current: 15243,
      limit: 50000,
      unit: "messages",
    },
    healthChecks: [
      { name: "Latency", value: "120ms", status: "warning" },
      { name: "Error Rate", value: "0.5%", status: "healthy" },
      { name: "Success Rate", value: "99.5%", status: "healthy" },
    ],
  },
  {
    id: "agent",
    name: "Agent Server",
    description: "AI model deployment and management",
    icon: Server,
    status: "active",
    provider: "Custom",
    usage: {
      current: 45678,
      limit: 100000,
      unit: "requests",
    },
    healthChecks: [
      { name: "Latency", value: "250ms", status: "healthy" },
      { name: "Error Rate", value: "0.2%", status: "healthy" },
      { name: "Success Rate", value: "99.8%", status: "healthy" },
    ],
  },
];

const availableIntegrations: AvailableIntegration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect with customers via WhatsApp",
    icon: Globe,
    status: "available",
    category: "messaging",
  },
  {
    id: "websocket",
    name: "WebSocket API",
    description: "Real-time communication endpoint",
    icon: Terminal,
    status: "available",
    category: "api",
  },
  {
    id: "webhook",
    name: "Webhook Integration",
    description: "Custom event notifications",
    icon: FileCode,
    status: "available",
    category: "api",
  },
];

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const usagePercentage =
    (integration.usage.current / integration.usage.limit) * 100;
  const usageColor =
    usagePercentage > 90
      ? ThemeColors.utility.error
      : usagePercentage > 75
        ? ThemeColors.utility.warning
        : ThemeColors.utility.success;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
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
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${ThemeColors.accent}15`,
              }}
            >
              <integration.icon
                className="h-5 w-5"
                style={{ color: ThemeColors.accent }}
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {integration.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {integration.provider}
              </p>
            </div>
          </div>
          <motion.button
            className="p-2"
            style={{
              clipPath: ThemeColors.polygons.sm,
              backgroundColor: `${ThemeColors.accent}10`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings2
              className="h-4 w-4"
              style={{ color: ThemeColors.accent }}
            />
          </motion.button>
        </div>

        {/* Usage Stats */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Usage ({integration.usage.unit})
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {integration.usage.current.toLocaleString()} /{" "}
              {integration.usage.limit.toLocaleString()}
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${usagePercentage}%`,
                backgroundColor: usageColor,
              }}
            />
          </div>
        </div>

        {/* Health Checks */}
        <div
          className="space-y-2 p-3"
          style={{
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(0, 0, 0, 0.02)",
            clipPath: ThemeColors.polygons.sm,
          }}
        >
          {integration.healthChecks.map((check) => (
            <div key={check.name} className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {check.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {check.value}
                </span>
                {check.status === "healthy" ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AvailableIntegrationCard = ({
  integration,
}: AvailableIntegrationCardProps) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <div
        className="flex items-start justify-between p-4"
        style={{
          clipPath: ThemeColors.polygons.sm,
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.02)",
          border: `1px solid ${ThemeColors.accent}20`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="rounded-lg p-2"
            style={{
              backgroundColor: `${ThemeColors.accent}10`,
            }}
          >
            <integration.icon
              className="h-4 w-4"
              style={{ color: ThemeColors.accent }}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {integration.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {integration.description}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 px-2 py-1"
          style={{
            clipPath: ThemeColors.polygons.sm,
            backgroundColor: `${ThemeColors.accent}15`,
            color: ThemeColors.accent,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={12} />
          <span className="text-xs font-medium">Add</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function IntegrationsPage() {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                Integrations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your service integrations and connections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  clipPath: ThemeColors.polygons.sm,
                  backgroundColor: ThemeColors.accent,
                  color: "#FFFFFF",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                <span className="text-sm font-medium">New Integration</span>
              </motion.button>
            </div>
          </div>

          {/* Active Integrations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>

          {/* Available Integrations */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Available Integrations
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {availableIntegrations.map((integration) => (
                <AvailableIntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
