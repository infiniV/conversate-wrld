"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeColors } from "~/components/ThemeConstants";
import {
  Server,
  Phone,
  Bot,
  BellRing,
  Mail,
  Shield,
  Save,
  type LucideIcon,
} from "lucide-react";

// Types
interface SettingsField {
  name: string;
  label: string;
  type: "text" | "number" | "password" | "select";
  value: string;
  placeholder?: string;
  options?: string[];
}

interface SettingsSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: SettingsField[];
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
}

interface ConfigPanelProps {
  section: SettingsSection;
}

const settingsSections: SettingsSection[] = [
  {
    id: "agent",
    title: "Agent Configuration",
    icon: Bot,
    fields: [
      {
        name: "modelEndpoint",
        label: "Model Endpoint",
        type: "text",
        value: "https://api.example.com/agent",
        placeholder: "Enter model endpoint URL",
      },
      {
        name: "maxConcurrentSessions",
        label: "Max Concurrent Sessions",
        type: "number",
        value: "50",
        placeholder: "Enter max sessions",
      },
      {
        name: "responseTimeout",
        label: "Response Timeout (ms)",
        type: "number",
        value: "5000",
        placeholder: "Enter timeout in milliseconds",
      },
    ],
  },
  {
    id: "comms",
    title: "Communication Server",
    icon: Server,
    fields: [
      {
        name: "serverUrl",
        label: "Server URL",
        type: "text",
        value: "wss://comms.example.com",
        placeholder: "Enter server URL",
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        value: "••••••••••••••••",
        placeholder: "Enter API key",
      },
    ],
  },
  {
    id: "voice",
    title: "Voice Integration",
    icon: Phone,
    fields: [
      {
        name: "provider",
        label: "Voice Provider",
        type: "select",
        value: "twilio",
        options: ["twilio", "freeswitch", "custom"],
      },
      {
        name: "accountSid",
        label: "Account SID",
        type: "text",
        value: "AC******************",
        placeholder: "Enter account SID",
      },
    ],
  },
];

const ConfigPanel = ({ section }: ConfigPanelProps) => {
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
            <section.icon
              className="h-5 w-5"
              style={{ color: ThemeColors.accent }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {section.title}
          </h3>
        </div>

        <div className="space-y-4">
          {section.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  defaultValue={field.value}
                  className="w-full border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 dark:bg-gray-800"
                  style={{
                    clipPath: ThemeColors.polygons.sm,
                  }}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 dark:bg-gray-800"
                  style={{
                    clipPath: ThemeColors.polygons.sm,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationSettings = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const notifications: NotificationSetting[] = [
    {
      id: "system",
      title: "System Notifications",
      description: "Get notified about system status and updates",
      icon: BellRing,
      enabled: true,
    },
    {
      id: "email",
      title: "Email Reports",
      description: "Receive daily performance reports via email",
      icon: Mail,
      enabled: true,
    },
    {
      id: "security",
      title: "Security Alerts",
      description: "Important security-related notifications",
      icon: Shield,
      enabled: true,
    },
  ];

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
            <BellRing
              className="h-5 w-5"
              style={{ color: ThemeColors.accent }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-3"
              style={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                clipPath: ThemeColors.polygons.sm,
              }}
            >
              <div className="flex items-start gap-3">
                <notification.icon className="mt-0.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.description}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked={notification.enabled}
                />
                <div
                  className="peer h-5 w-9 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"
                  style={{
                    backgroundColor: notification.enabled
                      ? ThemeColors.accent
                      : isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function SettingsPage() {
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
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Configure your AI customer service platform
              </p>
            </div>
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
              <Save size={16} />
              <span className="text-sm font-medium">Save Changes</span>
            </motion.button>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {settingsSections.map((section) => (
              <ConfigPanel key={section.id} section={section} />
            ))}
          </div>

          {/* Notifications Section */}
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
