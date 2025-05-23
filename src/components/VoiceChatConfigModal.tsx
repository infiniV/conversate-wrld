"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  X,
  User,
  Globe,
  Mic,
  Clock,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  Check,
  FileText,
  Settings,
  Brain,
  Volume2,
  Radio,
  Heart,
  Stethoscope,
  Shield,
  Plane,
  Car,
} from "lucide-react";
import { ThemeColors } from "./ThemeConstants";
import {
  type LiveKitRoomConfig,
  type VoiceModel,
  type SupportedLanguage,
  VOICE_MODELS,
  SUPPORTED_LANGUAGES,
  STT_MODELS,
  LLM_MODELS,
  TTS_MODELS,
  encodeLiveKitRoomConfig,
  ASSISTANT_PERSONAS,
  type AssistantPersona,
} from "~/types/livekit";

interface VoiceChatConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomName: string, config: LiveKitRoomConfig) => void;
}

interface CustomDropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

interface ModelToggleButtonProps {
  label: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  selectedModel: string;
}

interface PersonaButtonProps {
  persona: (typeof ASSISTANT_PERSONAS)[AssistantPersona];
  isSelected: boolean;
  onClick: () => void;
}

const ModelToggleButton = ({
  label,
  icon,
  isEnabled,
  setIsEnabled,
  selectedModel,
}: ModelToggleButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={() => setIsEnabled(!isEnabled)}
      className="relative flex w-full flex-col items-center overflow-hidden p-0 backdrop-blur-sm transition-all duration-300"
      style={{
        height: "70px", // Reduced height from 100px
        clipPath:
          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))", // Reduced polygon cuts
        backgroundColor: isEnabled
          ? `${ThemeColors.accent}15`
          : isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.03)",
        border: `1px solid ${
          isEnabled
            ? ThemeColors.accent
            : isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)"
        }`,
      }}
      whileHover={{
        backgroundColor: isEnabled
          ? `${ThemeColors.accent}25`
          : isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
        scale: 1.02,
        boxShadow: `0 8px 20px ${isEnabled ? `${ThemeColors.accent}30` : "rgba(0,0,0,0.1)"}`, // Reduced shadow
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glass accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[1px]" // Reduced from 2px
        style={{
          background: isEnabled
            ? `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />

      {/* Content wrapper */}
      <div className="flex h-full w-full flex-col items-center justify-between p-3">
        {" "}
        {/* Reduced padding from p-5 */}
        {/* Icon */}
        <motion.div
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-full" // Reduced from h-16 w-16 and mb-3
          style={{
            background: isEnabled
              ? `radial-gradient(circle, ${ThemeColors.accent}25 0%, ${ThemeColors.accent}05 70%)`
              : "transparent",
          }}
          animate={{
            scale: isEnabled ? [1, 1.05, 1] : 1,
          }}
          transition={{
            repeat: isEnabled ? Infinity : 0,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <span
            className="text-lg"
            style={{ color: isEnabled ? ThemeColors.accent : undefined }}
          >
            {icon}
          </span>
        </motion.div>
        {/* Text */}
        <div className="w-full text-center">
          {" "}
          <div className="text-[10px] font-medium">{label}</div>
          {selectedModel && isEnabled && (
            <div className="mt-0.5 max-w-full truncate px-1 text-[8px] opacity-70">
              {selectedModel}
            </div>
          )}
        </div>
        {/* Toggle switch */}
        <motion.div className="relative mt-2 h-4 w-8">
          {" "}
          {/* Reduced from h-6 w-12 and mt-3 */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))", // Reduced polygon cuts
              backgroundColor: isEnabled
                ? `${ThemeColors.accent}30`
                : "rgba(128,128,128,0.2)",
              border: `1px solid ${isEnabled ? ThemeColors.accent : "rgba(128,128,128,0.3)"}`,
            }}
          >
            <motion.div
              className="absolute top-0.5 h-3 w-3" // Reduced from h-5 w-5
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
                backgroundColor: isEnabled ? ThemeColors.accent : "#6B7280",
              }}
              animate={{
                x: isEnabled ? 16 : 2, // Reduced from 24 to 16
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.button>
  );
};

const CustomDropdown = ({
  label,
  icon,
  value,
  options,
  onChange,
  error,
  placeholder,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const formatOptionLabel = (option: string) => {
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <div className="relative">
      {" "}
      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium">
        {icon}
        {label}
      </label>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border bg-transparent px-3 py-2 text-left text-xs backdrop-blur-sm transition-all duration-300 focus:scale-[1.01] focus:outline-none"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))", // Reduced polygon cuts
          borderColor: isDark
            ? isOpen
              ? "rgba(255,255,255,0.3)"
              : "rgba(255,255,255,0.1)"
            : isOpen
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0.1)",
          color: isDark ? "white" : "black",
        }}
        whileHover={{
          borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        }}
      >
        <span
          className={
            value ? undefined : isDark ? "text-white/50" : "text-black/50"
          }
        >
          {value ? formatOptionLabel(value) : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} /> {/* Reduced from 16 */}
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-10 mt-1.5 max-h-40 overflow-auto"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))", // Reduced polygon cuts
              background: isDark
                ? "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.90) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 100%)",
              border: `1px solid ${ThemeColors.accent}20`,
              backdropFilter: "blur(20px)",
              boxShadow: isDark
                ? `0 8px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)` // Reduced shadow
                : `0 8px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.9)`, // Reduced shadow
            }}
          >
            {/* Scrollable options container */}
            <div className="py-1.5">
              {" "}
              {/* Reduced from py-2 */}
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-all duration-200"
                  style={{
                    backgroundColor:
                      value === option
                        ? `${ThemeColors.accent}15`
                        : "transparent",
                    color:
                      value === option
                        ? ThemeColors.accent
                        : isDark
                          ? "white"
                          : "black",
                  }}
                  whileHover={{
                    backgroundColor:
                      value === option
                        ? `${ThemeColors.accent}20`
                        : isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.05)",
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <span className="font-medium">
                    {formatOptionLabel(option)}
                  </span>
                  {value === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Check size={12} style={{ color: ThemeColors.accent }} />{" "}
                      {/* Reduced from 14 */}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Bottom accent line */}
            <div
              className="h-[1px] w-full opacity-40"
              style={{
                background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}60, transparent)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          className="mt-1 text-[10px] text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

const PersonaButton = ({
  persona,
  isSelected,
  onClick,
}: PersonaButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const IconComponent = {
    Heart,
    Stethoscope,
    Shield,
    Plane,
    Car,
  }[persona.icon];

  return (
    <motion.button
      onClick={onClick}
      className="relative flex w-full flex-col items-center overflow-hidden p-0 backdrop-blur-sm transition-all duration-300"
      style={{
        height: "80px",
        clipPath:
          "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
        backgroundColor: isSelected
          ? `${ThemeColors.accent}15`
          : isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.03)",
        border: `1px solid ${
          isSelected
            ? ThemeColors.accent
            : isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)"
        }`,
      }}
      whileHover={{
        backgroundColor: isSelected
          ? `${ThemeColors.accent}25`
          : isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
        scale: 1.02,
        boxShadow: `0 8px 20px ${isSelected ? `${ThemeColors.accent}30` : "rgba(0,0,0,0.1)"}`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glass accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[1px]"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${ThemeColors.accent}, transparent)`
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />

      {/* Content wrapper */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: isSelected
              ? `radial-gradient(circle, ${ThemeColors.accent}25 0%, ${ThemeColors.accent}05 70%)`
              : "transparent",
          }}
          animate={{
            scale: isSelected ? [1, 1.05, 1] : 1,
          }}
          transition={{
            repeat: isSelected ? Infinity : 0,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <IconComponent
            size={16}
            style={{ color: isSelected ? ThemeColors.accent : undefined }}
          />
        </motion.div>

        <div className="text-center">
          <div className="text-[10px] font-medium">{persona.title}</div>
        </div>
      </div>
    </motion.button>
  );
};

export const VoiceChatConfigModal = ({
  isOpen,
  onClose,
  onSubmit,
}: VoiceChatConfigModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [config, setConfig] = useState<Omit<LiveKitRoomConfig, "timeStamp">>({
    userId: `user-${Math.floor(Math.random() * 10000)}`,
    language: "english",
    userName: "",
    greet: true,
    voice: "alloy",
  });
  // State to track if instructions are enabled
  // State for persona selection is managed through config.instructions

  // State to track if advanced options are enabled
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [sttModelEnabled, setSttModelEnabled] = useState(false);
  const [llmModelEnabled, setLlmModelEnabled] = useState(false);
  const [ttsModelEnabled, setTtsModelEnabled] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LiveKitRoomConfig, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform([mouseX, mouseY], (latest: number[]) => {
    return `radial-gradient(300px circle at ${latest[0]}px ${latest[1]}px, ${ThemeColors.accent}10, transparent)`;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LiveKitRoomConfig, string>> = {};

    if (!config.userId.trim()) {
      newErrors.userId = "User ID is required";
    }

    if (!config.language) {
      newErrors.language = "Language selection is required";
    }

    if (!config.voice) {
      newErrors.voice = "Voice model selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Add a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create final config with timestamp
    const finalConfig: LiveKitRoomConfig = {
      ...config,
      timeStamp: Date.now(),
    }; // Include instructions if they are set
    if (config.instructions?.trim()) {
      finalConfig.instructions = config.instructions.trim();
    } else {
      delete finalConfig.instructions;
    }

    // Only include advanced models if they're enabled
    if (sttModelEnabled && config.stt_model) {
      finalConfig.stt_model = config.stt_model;
    } else {
      delete finalConfig.stt_model;
    }

    if (llmModelEnabled && config.llm_model) {
      finalConfig.llm_model = config.llm_model;
    } else {
      delete finalConfig.llm_model;
    }

    if (ttsModelEnabled && config.tts_model) {
      finalConfig.tts_model = config.tts_model;
    } else {
      delete finalConfig.tts_model;
    }

    const roomName = encodeLiveKitRoomConfig(finalConfig);
    onSubmit(roomName, finalConfig);
    setIsSubmitting(false);
  };

  const formFieldClasses = `
    w-full px-4 py-3 bg-transparent border transition-all duration-300 
    focus:outline-none focus:scale-[1.01] backdrop-blur-sm
    ${
      isDark
        ? "border-white/10 hover:border-white/20 focus:border-white/30 text-white placeholder-white/50"
        : "border-black/10 hover:border-black/20 focus:border-black/30 text-black placeholder-black/50"
    }
  `;

  const iconColor = ThemeColors.accent;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
          style={{
            background: isDark
              ? "rgba(0, 0, 0, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
            className="relative my-8 w-full max-w-3xl"
            onMouseMove={handleMouseMove}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              background: isDark
                ? "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.90) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 100%)",
              border: `1px solid ${ThemeColors.accent}30`,
              boxShadow: isDark
                ? `0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), 0 0 20px ${ThemeColors.accent}15`
                : `0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.9), 0 0 20px ${ThemeColors.accent}10`,
            }}
          >
            {/* Mouse follow effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{ background }}
            />
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
                  : "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />
            {/* Accent line animations */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 h-[1px] w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}60, transparent)`,
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute bottom-0 h-[1px] w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}40, transparent)`,
                }}
                animate={{
                  x: ["100%", "-100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
            </div>{" "}
            <div className="relative max-h-[calc(100vh-4rem)] overflow-y-auto p-5">
              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <motion.h2
                    className="text-lg font-bold tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Voice Experience Setup
                  </motion.h2>
                  <motion.p
                    className={`mt-1 text-xs ${isDark ? "text-white/60" : "text-black/60"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Configure your personalized conversation preferences
                  </motion.p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center transition-all duration-200"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <X size={16} />
                </motion.button>
              </div>{" "}
              {/* Form */}{" "}
              <motion.div
                className="grid grid-cols-1 gap-5 lg:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* User ID */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <User size={14} style={{ color: iconColor }} />
                    Session ID
                  </label>
                  <input
                    type="text"
                    value={config.userId}
                    onChange={(e) =>
                      setConfig({ ...config, userId: e.target.value })
                    }
                    className={formFieldClasses}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                    placeholder="Enter your session identifier"
                  />
                  {errors.userId && (
                    <motion.p
                      className="mt-2 text-xs text-red-400"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.userId}
                    </motion.p>
                  )}
                </motion.div>
                {/* User Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <MessageCircle size={14} style={{ color: iconColor }} />
                    Display Name{" "}
                    <span className="text-xs opacity-60">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={config.userName}
                    onChange={(e) =>
                      setConfig({ ...config, userName: e.target.value })
                    }
                    className={formFieldClasses}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                    placeholder="How should we address you?"
                  />
                </motion.div>{" "}
                {/* Language Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CustomDropdown
                    label="Conversation Language"
                    icon={<Globe size={14} style={{ color: iconColor }} />}
                    value={config.language}
                    options={SUPPORTED_LANGUAGES}
                    onChange={(value) =>
                      setConfig({
                        ...config,
                        language: value as SupportedLanguage,
                      })
                    }
                    error={errors.language}
                    placeholder="Select your preferred language"
                  />
                </motion.div>
                {/* Voice Model */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CustomDropdown
                    label="Voice Character"
                    icon={<Mic size={14} style={{ color: iconColor }} />}
                    value={config.voice}
                    options={VOICE_MODELS}
                    onChange={(value) =>
                      setConfig({ ...config, voice: value as VoiceModel })
                    }
                    error={errors.voice}
                    placeholder="Choose your AI voice"
                  />
                </motion.div>{" "}
                {/* Greeting Option */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {" "}
                  <label className="flex items-center gap-1.5 text-xs font-medium">
                    <Clock size={12} style={{ color: iconColor }} />
                    Welcome greeting on join
                  </label>
                  <motion.button
                    onClick={() =>
                      setConfig({ ...config, greet: !config.greet })
                    }
                    className="relative h-4 w-8 transition-all duration-300"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                      backgroundColor: config.greet
                        ? `${ThemeColors.accent}30`
                        : "rgba(128,128,128,0.2)",
                      border: `1px solid ${config.greet ? ThemeColors.accent : "rgba(128,128,128,0.3)"}`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 h-3 w-3"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
                        backgroundColor: config.greet
                          ? ThemeColors.accent
                          : "#6B7280",
                      }}
                      animate={{
                        x: config.greet ? 16 : 2,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </motion.div>{" "}
                {/* Assistant Persona Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="mb-3">
                    <label className="flex items-center gap-1.5 text-xs font-medium">
                      <FileText size={12} style={{ color: iconColor }} />
                      Select Assistant Persona
                    </label>
                    <p
                      className={`mt-1 text-[10px] ${isDark ? "text-white/50" : "text-black/50"}`}
                    >
                      Choose a specialized AI assistant for your conversation
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {(
                      Object.keys(ASSISTANT_PERSONAS) as AssistantPersona[]
                    ).map((key) => {
                      const persona = ASSISTANT_PERSONAS[key];                      const isSelected =
                        config.instructions?.trim() === persona.instruction.trim();

                      return (
                        <PersonaButton
                          key={persona.id}
                          persona={persona}
                          isSelected={isSelected}                          onClick={() =>
                            setConfig({
                              ...config,
                              instructions: isSelected
                                ? ""
                                : persona.instruction.trim(),
                            })
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Custom Instructions Text Area */}
                  <div className="mt-4 border-t border-[rgba(128,128,128,0.2)] pt-4">
                    <div className="mb-2">
                      <label className="flex items-center gap-1.5 text-xs font-medium">
                        <FileText size={12} style={{ color: iconColor }} />
                        Custom Instructions
                        <span className="text-[10px] opacity-60">(Optional)</span>
                      </label>
                      <p className={`mt-1 text-[10px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                        Or provide your own specific instructions for the AI assistant
                      </p>
                    </div>
                    <textarea                      value={Object.values(ASSISTANT_PERSONAS).some(
                        p => p.instruction.trim() === config.instructions?.trim()
                      ) ? "" : (config.instructions ?? "")}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          instructions: e.target.value,
                        })
                      }
                      className={`w-full resize-none rounded-none border bg-transparent px-3 py-2 text-xs backdrop-blur-sm transition-all duration-300 placeholder:text-[10px] placeholder:opacity-50 focus:outline-none focus:ring-0 ${
                        isDark
                          ? "border-white/10 hover:border-white/20 focus:border-white/30 text-white placeholder-white/50"
                          : "border-black/10 hover:border-black/20 focus:border-black/30 text-black placeholder-black/50"
                      }`}
                      style={{
                        height: "60px",
                        clipPath:
                          "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                      }}
                      placeholder="Enter custom instructions for how the AI should behave..."
                    />
                  </div>
                </motion.div>
                {/* Advanced Configuration Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    {" "}
                    <label className="flex items-center gap-1.5 text-xs font-medium">
                      <Settings size={12} style={{ color: iconColor }} />
                      Advanced Configuration
                      <span className="text-[10px] opacity-60">(Optional)</span>
                    </label>
                    <motion.button
                      onClick={() => setAdvancedEnabled(!advancedEnabled)}
                      className="relative h-4 w-8 transition-all duration-300"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                        backgroundColor: advancedEnabled
                          ? `${ThemeColors.accent}30`
                          : "rgba(128,128,128,0.2)",
                        border: `1px solid ${advancedEnabled ? ThemeColors.accent : "rgba(128,128,128,0.3)"}`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-0.5 h-3 w-3"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
                          backgroundColor: advancedEnabled
                            ? ThemeColors.accent
                            : "#6B7280",
                        }}
                        animate={{
                          x: advancedEnabled ? 16 : 2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {advancedEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 space-y-4"
                      >
                        <p
                          className={`mb-4 text-sm ${isDark ? "text-white/60" : "text-black/60"}`}
                        >
                          Select optional AI models to use for this
                          conversation. Default models will be used if none are
                          selected.
                        </p>{" "}
                        {/* Model selection grid */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {/* STT Model */}
                          <ModelToggleButton
                            label="Speech Recognition"
                            icon={<Radio size={24} />}
                            isEnabled={sttModelEnabled}
                            setIsEnabled={(enabled) => {
                              setSttModelEnabled(enabled);
                              if (enabled && !config.stt_model) {
                                setConfig({
                                  ...config,
                                  stt_model: "whisper-large-v3-turbo",
                                });
                              }
                            }}
                            selectedModel={config.stt_model ?? ""}
                          />{" "}
                          {/* LLM Model */}
                          <ModelToggleButton
                            label="Language Model"
                            icon={<Brain size={24} />}
                            isEnabled={llmModelEnabled}
                            setIsEnabled={(enabled) => {
                              setLlmModelEnabled(enabled);
                              if (enabled && !config.llm_model) {
                                setConfig({
                                  ...config,
                                  llm_model: "llama-3.3-70b-versatile",
                                });
                              }
                            }}
                            selectedModel={config.llm_model ?? ""}
                          />{" "}
                          {/* TTS Model */}
                          <ModelToggleButton
                            label="Voice Synthesis"
                            icon={<Volume2 size={24} />}
                            isEnabled={ttsModelEnabled}
                            setIsEnabled={(enabled) => {
                              setTtsModelEnabled(enabled);
                              if (enabled && !config.tts_model) {
                                setConfig({
                                  ...config,
                                  tts_model: "gpt-4o-mini-tts",
                                });
                              }
                            }}
                            selectedModel={config.tts_model ?? ""}
                          />
                        </div>
                        {/* STT Model Selection */}
                        <AnimatePresence>
                          {sttModelEnabled && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {" "}
                              <div className="mt-4">
                                <CustomDropdown
                                  label="Speech-to-Text Model"
                                  icon={
                                    <Radio
                                      size={14}
                                      style={{ color: iconColor }}
                                    />
                                  }
                                  value={config.stt_model ?? ""}
                                  options={STT_MODELS}
                                  onChange={(value) =>
                                    setConfig({ ...config, stt_model: value })
                                  }
                                  placeholder="Select a speech recognition model"
                                />
                                <p
                                  className={`mt-2 text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
                                >
                                  Higher quality models provide more accurate
                                  transcription at the cost of speed.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* LLM Model Selection */}
                        <AnimatePresence>
                          {llmModelEnabled && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {" "}
                              <div className="mt-4">
                                <CustomDropdown
                                  label="Language Model"
                                  icon={
                                    <Brain
                                      size={14}
                                      style={{ color: iconColor }}
                                    />
                                  }
                                  value={config.llm_model ?? ""}
                                  options={LLM_MODELS}
                                  onChange={(value) =>
                                    setConfig({ ...config, llm_model: value })
                                  }
                                  placeholder="Select a language model"
                                />
                                <p
                                  className={`mt-2 text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
                                >
                                  Larger models offer more sophisticated
                                  responses but may be slower.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* TTS Model Selection */}
                        <AnimatePresence>
                          {ttsModelEnabled && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {" "}
                              <div className="mt-4">
                                <CustomDropdown
                                  label="Text-to-Speech Model"
                                  icon={
                                    <Volume2
                                      size={14}
                                      style={{ color: iconColor }}
                                    />
                                  }
                                  value={config.tts_model ?? ""}
                                  options={TTS_MODELS}
                                  onChange={(value) =>
                                    setConfig({ ...config, tts_model: value })
                                  }
                                  placeholder="Select a speech synthesis model"
                                />
                                <p
                                  className={`mt-2 text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
                                >
                                  HD models provide higher quality audio with
                                  more natural intonation.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>{" "}
              {/* Actions */}{" "}
              <motion.div
                className="mt-6 flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium transition-all duration-300"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-1 py-2 text-sm font-medium text-white transition-all duration-300"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    background: `linear-gradient(180deg, ${ThemeColors.accent}, ${ThemeColors.accent}CC)`,
                    boxShadow: `0 8px 25px ${ThemeColors.accent}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.02,
                    y: isSubmitting ? 0 : -1,
                    boxShadow: isSubmitting
                      ? undefined
                      : `0 12px 30px ${ThemeColors.accent}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      <span>Launch Experience</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
