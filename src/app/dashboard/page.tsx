"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "~/components/ThemeConstants";
import { api } from "~/trpc/react";
import {
  BarChart3,
  MessagesSquare,
  Phone,
  Settings,
  Users,
  Zap,
  Gauge,
  Server,
  AlertCircle,
  CheckCircle2,
  Bot,
  MessageSquare,
  Star,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

// Types
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  chart?: number[] | null;
}

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  chart,
}: MetricCardProps) => {
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
        className="h-full p-6"
        style={{
          clipPath: ThemeColors.polygons.md,
          backgroundColor: isDark
            ? ThemeColors.dark.subtleUI
            : ThemeColors.light.subtleUI,
          backdropFilter: "blur(16px)",
          border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
        }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${ThemeColors.accent}15`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color: ThemeColors.accent }} />
            </div>
            <h3
              style={{
                color: isDark
                  ? ThemeColors.dark.secondaryText
                  : ThemeColors.light.secondaryText,
              }}
            >
              {title}
            </h3>
          </div>
          {typeof change !== "undefined" && (
            <div
              style={{
                color:
                  change >= 0
                    ? ThemeColors.utility.success
                    : ThemeColors.utility.error,
              }}
              className="text-xs font-medium"
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span
            style={{
              color: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
            }}
            className="text-2xl font-bold"
          >
            {value}
          </span>
        </div>

        {chart && (
          <div className="mt-4 h-10">
            <div className="flex h-full items-end gap-1">
              {chart.map((value, index) => (
                <div
                  key={`chart-bar-${index}`}
                  className="w-full"
                  style={{
                    height: `${(value / Math.max(...chart)) * 100}%`,
                    backgroundColor: `${ThemeColors.accent}${
                      index === chart.length - 1 ? "40" : "20"
                    }`,
                    transition: "height 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const IntegrationStatus = () => {
  const { data: dashboardData } = api.dashboard.getDashboardMetrics.useQuery();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!dashboardData) return null;

  const icons: Record<string, LucideIcon> = {
    "Agent Server": Server,
    "Communication Server": MessagesSquare,
    "Voice Integration": Phone,
  };

  return (
    <motion.div
      className="relative col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div
        className="p-6"
        style={{
          clipPath: ThemeColors.polygons.md,
          backgroundColor: isDark
            ? ThemeColors.dark.subtleUI
            : ThemeColors.light.subtleUI,
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
            <Gauge className="h-5 w-5" style={{ color: ThemeColors.accent }} />
          </div>
          <h3
            style={{
              color: isDark
                ? ThemeColors.dark.secondaryText
                : ThemeColors.light.secondaryText,
            }}
            className="text-sm font-medium"
          >
            System Status
          </h3>
        </div>

        <div className="space-y-4">
          {dashboardData.systemStatus.map((integration) => {
            const Icon = icons[integration.name] ?? Server; // Fallback to Server icon
            return (
              <div
                key={integration.name}
                className="flex items-center justify-between p-3"
                style={{
                  backgroundColor: isDark
                    ? `${ThemeColors.dark.background}80`
                    : `${ThemeColors.light.background}80`,
                  clipPath: ThemeColors.polygons.sm,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-4 w-4"
                    style={{
                      color: isDark
                        ? ThemeColors.dark.secondaryText
                        : ThemeColors.light.secondaryText,
                    }}
                  />
                  <span
                    style={{
                      color: isDark
                        ? ThemeColors.dark.text
                        : ThemeColors.light.text,
                    }}
                  >
                    {integration.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {integration.status === "operational" ? (
                    <>
                      <CheckCircle2
                        className="h-4 w-4"
                        style={{ color: ThemeColors.utility.success }}
                      />
                      <span
                        style={{
                          color: isDark
                            ? ThemeColors.dark.secondaryText
                            : ThemeColors.light.secondaryText,
                        }}
                        className="text-xs"
                      >
                        {integration.latency}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle
                        className="h-4 w-4"
                        style={{ color: ThemeColors.utility.warning }}
                      />
                      <span
                        style={{ color: ThemeColors.utility.warning }}
                        className="text-xs"
                      >
                        {integration.message}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const AgentPerformance = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Dummy agent performance data
  const agentMetrics = {
    accuracy: 96.5,
    avgResponseTime: "1.8s",
    conversations: 1247,
    satisfaction: 94.2,
    recentActivity: [
      { time: "10:45 AM", type: "call", duration: "4m 12s", satisfaction: 5 },
      { time: "10:32 AM", type: "chat", duration: "2m 55s", satisfaction: 4 },
      { time: "10:15 AM", type: "call", duration: "3m 30s", satisfaction: 5 },
    ],
  };

  return (
    <motion.div
      className="relative col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div
        className="p-6"
        style={{
          clipPath: ThemeColors.polygons.md,
          backgroundColor: isDark
            ? ThemeColors.dark.subtleUI
            : ThemeColors.light.subtleUI,
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
            <Bot className="h-5 w-5" style={{ color: ThemeColors.accent }} />
          </div>
          <h3
            style={{
              color: isDark
                ? ThemeColors.dark.secondaryText
                : ThemeColors.light.secondaryText,
            }}
            className="text-sm font-medium"
          >
            Agent Performance
          </h3>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div
            className="p-3"
            style={{
              backgroundColor: isDark
                ? `${ThemeColors.dark.background}80`
                : `${ThemeColors.light.background}80`,
              clipPath: ThemeColors.polygons.sm,
            }}
          >
            <div
              style={{
                color: isDark
                  ? ThemeColors.dark.secondaryText
                  : ThemeColors.light.secondaryText,
              }}
              className="mb-1 text-xs"
            >
              Accuracy
            </div>
            <div
              style={{
                color: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
              }}
              className="text-xl font-bold"
            >
              {agentMetrics.accuracy}%
            </div>
          </div>
          <div
            className="p-3"
            style={{
              backgroundColor: isDark
                ? `${ThemeColors.dark.background}80`
                : `${ThemeColors.light.background}80`,
              clipPath: ThemeColors.polygons.sm,
            }}
          >
            <div
              style={{
                color: isDark
                  ? ThemeColors.dark.secondaryText
                  : ThemeColors.light.secondaryText,
              }}
              className="mb-1 text-xs"
            >
              Avg Response
            </div>
            <div
              style={{
                color: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
              }}
              className="text-xl font-bold"
            >
              {agentMetrics.avgResponseTime}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {agentMetrics.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2"
              style={{
                backgroundColor: isDark
                  ? `${ThemeColors.dark.background}80`
                  : `${ThemeColors.light.background}80`,
                clipPath: ThemeColors.polygons.sm,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center"
                  style={{
                    backgroundColor: `${ThemeColors.accent}10`,
                    clipPath: ThemeColors.polygons.sm,
                  }}
                >
                  {activity.type === "call" ? (
                    <Phone size={14} style={{ color: ThemeColors.accent }} />
                  ) : (
                    <MessageSquare
                      size={14}
                      style={{ color: ThemeColors.accent }}
                    />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      color: isDark
                        ? ThemeColors.dark.text
                        : ThemeColors.light.text,
                    }}
                    className="text-xs font-medium"
                  >
                    {activity.time}
                  </div>
                  <div
                    style={{
                      color: isDark
                        ? ThemeColors.dark.secondaryText
                        : ThemeColors.light.secondaryText,
                    }}
                    className="text-xs"
                  >
                    {activity.duration}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    style={{
                      color:
                        i < activity.satisfaction
                          ? ThemeColors.secondaryAccents.amber
                          : isDark
                            ? ThemeColors.dark.border
                            : ThemeColors.light.border,
                    }}
                    fill={i < activity.satisfaction ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { data: dashboardData, isLoading } =
    api.dashboard.getDashboardMetrics.useQuery();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (isLoading || !dashboardData) {
    return <div>Loading...</div>; // You might want to add a proper loading state
  }

  return (
    <div className="relative min-h-screen py-8">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${
            isDark ? ThemeColors.dark.background : ThemeColors.light.background
          }, ${isDark ? ThemeColors.dark.subtleUI : ThemeColors.light.subtleUI})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8">
        <div className="flex flex-col gap-8">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="mb-2 text-4xl font-bold"
                style={{
                  color: isDark
                    ? ThemeColors.dark.text
                    : ThemeColors.light.text,
                }}
              >
                {dashboardData.business.name}
              </h1>
              <p
                style={{
                  color: isDark
                    ? ThemeColors.dark.secondaryText
                    : ThemeColors.light.secondaryText,
                }}
              >
                Monitor your AI customer service performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  clipPath: ThemeColors.polygons.sm,
                  backgroundColor: ThemeColors.accent,
                  color: ThemeColors.dark.text,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                <span className="text-sm font-medium">Settings</span>
              </motion.button>
              <motion.button
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  clipPath: ThemeColors.polygons.sm,
                  backgroundColor: isDark
                    ? ThemeColors.dark.subtleUI
                    : ThemeColors.light.subtleUI,
                  color: isDark
                    ? ThemeColors.dark.text
                    : ThemeColors.light.text,
                  border: `1px solid ${ThemeColors.accent}${isDark ? "33" : "20"}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} style={{ color: ThemeColors.accent }} />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Conversations"
              value={dashboardData.metrics.conversations.total}
              change={dashboardData.metrics.conversations.increase}
              icon={MessagesSquare}
              chart={dashboardData.metrics.conversations.chart}
            />
            <MetricCard
              title="Avg. Response Time"
              value={dashboardData.metrics.contexts.avgResponseTime.current}
              change={
                -dashboardData.metrics.contexts.avgResponseTime.improvement
              }
              icon={Zap}
              chart={dashboardData.metrics.contexts.avgResponseTime.chart}
            />
            <MetricCard
              title="Satisfaction Rate"
              value={`${dashboardData.metrics.satisfaction.current}%`}
              change={dashboardData.metrics.satisfaction.increase}
              icon={Users}
              chart={dashboardData.metrics.satisfaction.chart}
            />
            <MetricCard
              title="Active Contexts"
              value={dashboardData.metrics.contexts.total}
              icon={BarChart3}
              chart={null}
            />
          </div>

          {/* Integration Status and Agent Performance */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <IntegrationStatus />
            <AgentPerformance />
          </div>
        </div>
      </div>
    </div>
  );
}
