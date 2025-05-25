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
      className="relative flex w-full flex-col items-center overflow-hidden p-0 backdrop-blur-sm transition-all duration-200 ease-out" // Faster transition
      style={{
        height: "75px", // Slightly reduced height
        clipPath:
          "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut (was 4px)
        backgroundColor: isEnabled
          ? `${ThemeColors.accent}10` // Less intense background
          : isDark
            ? "rgba(255,255,255,0.02)" // More subtle background
            : "rgba(0,0,0,0.02)",
        border: `1px solid ${
          isEnabled
            ? `${ThemeColors.accent}B3` // Slightly more opaque border when enabled
            : isDark
              ? "rgba(255,255,255,0.08)" // Subtler border
              : "rgba(0,0,0,0.08)"
        }`,
      }}
      whileHover={{
        backgroundColor: isEnabled
          ? `${ThemeColors.accent}20` // Consistent hover
          : isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
        scale: 1.015, // Slightly less scale
        boxShadow: `0 6px 15px ${isEnabled ? `${ThemeColors.accent}25` : "rgba(0,0,0,0.08)"}`,
      }}
      whileTap={{ scale: 0.985 }} // Slightly less tap scale
    >
      {/* Glass accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-px" // Thinner line
        style={{
          background: isEnabled
            ? `linear-gradient(90deg, transparent, ${ThemeColors.accent}80, transparent)` // Subtler gradient
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      {/* Content wrapper */}
      <div className="flex h-full w-full flex-col items-center justify-between p-2.5">
        {" "}
        {/* Adjusted padding */}
        {/* Icon */}
        <motion.div
          className="mb-1 flex h-9 w-9 items-center justify-center rounded-full" // Slightly smaller icon container
          style={{
            background: isEnabled
              ? `radial-gradient(circle, ${ThemeColors.accent}20 0%, ${ThemeColors.accent}03 70%)` // Subtler gradient
              : "transparent",
          }}
          animate={{
            scale: isEnabled ? [1, 1.03, 1] : 1, // Less pronounced animation
          }}
          transition={{
            repeat: isEnabled ? Infinity : 0,
            duration: 3.5, // Slightly slower for subtlety
            ease: "easeInOut",
          }}
        >
          <span
            className="text-base" // Slightly smaller icon via text size
            style={{ color: isEnabled ? ThemeColors.accent : undefined }}
          >
            {icon}
          </span>
        </motion.div>
        {/* Text */}
        <div className="w-full text-center">
          <div className="text-[11px] font-medium">{label}</div>
          {selectedModel && isEnabled && (
            <div className="mt-0.5 max-w-full truncate px-1 text-[8px] opacity-60">
              {selectedModel}
            </div>
          )}
        </div>
        {/* Toggle switch */}
        <motion.div className="relative mt-1.5 h-4 w-8">
          {" "}
          {/* More compact toggle */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
              backgroundColor: isEnabled
                ? `${ThemeColors.accent}25` // Subtler background
                : "rgba(128,128,128,0.15)",
              border: `1px solid ${isEnabled ? `${ThemeColors.accent}B3` : "rgba(128,128,128,0.2)"}`,
            }}
          >
            <motion.div
              className="absolute top-px h-3 w-3" // Adjusted size for h-4 parent
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 1px) 0, 100% 1px, 100% 100%, 1px 100%, 0 calc(100% - 1px))", // Sharper cut (was 1.5px)
                backgroundColor: isEnabled ? ThemeColors.accent : "#888", // Lighter grey for off state
              }}
              animate={{
                x: isEnabled ? 18 : 1.5, // Adjusted travel for w-8, knob w-3
              }}
              transition={{
                type: "spring",
                stiffness: 600, // Snappier animation
                damping: 25,
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
      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium">
        {" "}
        {/* Slightly smaller label */}
        {icon}
        {label}
      </label>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border bg-transparent px-3.5 py-2 text-left text-[13px] backdrop-blur-sm transition-all duration-200 ease-out focus:outline-none" // Adjusted padding, text, transition
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
          borderColor: isDark
            ? isOpen
              ? "rgba(255,255,255,0.25)"
              : "rgba(255,255,255,0.08)" // Subtler border
            : isOpen
              ? "rgba(0,0,0,0.25)"
              : "rgba(0,0,0,0.08)",
          color: isDark ? "white" : "black",
        }}
        whileHover={{
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", // Subtler hover
          scale: 1.01, // Less scale
        }}
      >
        <span
          className={
            value ? undefined : isDark ? "text-white/40" : "text-black/40" // More subtle placeholder
          }
        >
          {value ? formatOptionLabel(value) : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }} // Faster rotate
        >
          <ChevronDown size={13} /> {/* Slightly smaller icon */}
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }} // Faster animation
            className="absolute left-0 right-0 top-full z-10 mt-1 max-h-44 overflow-auto" // Reduced margin, adjusted max-h
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
              background: isDark
                ? "linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(5,5,5,0.90) 100%)" // Darker, more solid background
                : "linear-gradient(180deg, rgba(250,250,250,0.95) 0%, rgba(245,245,245,0.90) 100%)",
              border: `1px solid ${ThemeColors.accent}1A`,
              backdropFilter: "blur(16px)", // Slightly less blur
              boxShadow: isDark
                ? `0 6px 15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)` // Subtler shadow
                : `0 6px 15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)`,
            }}
          >
            <div className="py-1">
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="flex w-full items-center justify-between px-3.5 py-2 text-left text-[13px] transition-all duration-150 ease-out" // Adjusted padding, text, transition
                  style={{
                    backgroundColor:
                      value === option
                        ? `${ThemeColors.accent}15`
                        : "transparent",
                    color:
                      value === option
                        ? ThemeColors.accent
                        : isDark
                          ? "rgba(255,255,255,0.85)" // Brighter text for options
                          : "rgba(0,0,0,0.85)",
                  }}
                  whileHover={{
                    backgroundColor:
                      value === option
                        ? `${ThemeColors.accent}20`
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                  }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.015, duration: 0.15 }} // Faster stagger
                >
                  <span className="font-medium">
                    {formatOptionLabel(option)}
                  </span>
                  {value === option && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        duration: 0.15,
                      }}
                    >
                      <Check size={13} style={{ color: ThemeColors.accent }} />
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
          className="mt-1 text-[11px] text-red-400/90" // Smaller, slightly less opaque error
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
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
      className="relative flex w-full flex-col items-center overflow-hidden p-0 backdrop-blur-sm transition-all duration-200 ease-out" // Faster transition
      style={{
        height: "80px", // Slightly reduced height
        clipPath:
          "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
        backgroundColor: isSelected
          ? `${ThemeColors.accent}10` // Less intense background
          : isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.02)",
        border: `1px solid ${
          isSelected
            ? `${ThemeColors.accent}B3`
            : isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)"
        }`,
      }}
      whileHover={{
        backgroundColor: isSelected
          ? `${ThemeColors.accent}20`
          : isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
        scale: 1.015,
        boxShadow: `0 6px 15px ${isSelected ? `${ThemeColors.accent}25` : "rgba(0,0,0,0.08)"}`,
      }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Glass accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${ThemeColors.accent}80, transparent)`
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      {/* Content wrapper */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2.5">
        {" "}
        {/* Adjusted gap and padding */}
        <motion.div
          className="flex h-9 w-9 items-center justify-center rounded-full" // Slightly smaller icon container
          style={{
            background: isSelected
              ? `radial-gradient(circle, ${ThemeColors.accent}20 0%, ${ThemeColors.accent}03 70%)`
              : "transparent",
          }}
          animate={{
            scale: isSelected ? [1, 1.03, 1] : 1,
          }}
          transition={{
            repeat: isSelected ? Infinity : 0,
            duration: 3.5,
            ease: "easeInOut",
          }}
        >
          <IconComponent
            size={18} // Slightly smaller icon
            style={{ color: isSelected ? ThemeColors.accent : undefined }}
          />
        </motion.div>
        <div className="text-center">
          <div className="text-[11px] font-medium">{persona.title}</div>
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
  const [rtModeEnabled, setRtModeEnabled] = useState(false);

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

    // Include RT mode if enabled
    if (rtModeEnabled) {
      finalConfig.rt = true;
    } else {
      delete finalConfig.rt;
    }

    const roomName = encodeLiveKitRoomConfig(finalConfig);
    onSubmit(roomName, finalConfig);
    setIsSubmitting(false);
  };

  const formFieldClasses = `
    w-full px-3.5 py-2 bg-transparent border text-[13px] transition-all duration-200 ease-out 
    focus:outline-none focus:scale-[1.005] backdrop-blur-sm
    ${
      isDark
        ? "border-white/08 hover:border-white/15 focus:border-white/25 text-white placeholder-white/40"
        : "border-black/08 hover:border-black/15 focus:border-black/25 text-black placeholder-black/40"
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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.05 }} // Faster, less bounce
            className="relative my-8 w-full max-w-3xl"
            onMouseMove={handleMouseMove}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))", // Sharper cut (was 8px)
              background: isDark
                ? "linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(8,8,8,0.88) 100%)" // Slightly more transparent, darker
                : "linear-gradient(180deg, rgba(252,252,252,0.92) 0%, rgba(248,248,248,0.88) 100%)",
              border: `1px solid ${ThemeColors.accent}1A`, // Subtler border (was 26)
              boxShadow: isDark
                ? `0 20px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04), 0 0 15px ${ThemeColors.accent}10` // Subtler shadow
                : `0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03), 0 0 15px ${ThemeColors.accent}0A`,
            }}
          >
            {/* Mouse follow effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-25" // Less opacity (was 0.40)
              style={{ background }}
            />
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]" // More subtle grid
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)"
                  : "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
                backgroundSize: "6px 6px", // Smaller grid size
              }}
            />
            {/* Accent line animations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {" "}
              {/* Added pointer-events-none */}
              <motion.div
                className="absolute top-0 h-px w-full" // Thinner line
                style={{
                  background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}40, transparent)`,
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3.5, // Slightly faster
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute bottom-0 h-px w-full" // Thinner line
                style={{
                  background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}20, transparent)`,
                }}
                animate={{
                  x: ["100%", "-100%"],
                }}
                transition={{
                  duration: 4.5, // Slightly faster
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5, // Shorter delay
                }}
              />
            </div>{" "}
            <div className="relative max-h-[calc(100vh-3.5rem)] overflow-y-auto p-4 md:p-5 lg:p-6">
              {" "}
              {/* Adjusted padding */}
              {/* Header */}
              <div className="mb-5 flex items-start justify-between md:mb-6">
                {" "}
                {/* Adjusted margin */}
                <div>
                  <motion.h2
                    className="text-lg font-semibold tracking-tight md:text-xl" // Adjusted font weight and size
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                  >
                    Voice Experience Setup
                  </motion.h2>
                  <motion.p
                    className={`mt-0.5 text-[13px] ${isDark ? "text-white/50" : "text-black/50"}`} // Adjusted text size and opacity
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    Configure your personalized conversation preferences
                  </motion.p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex h-6 w-6 items-center justify-center transition-all duration-150 ease-out" // Smaller, faster transition
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                  }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, rotate: -60, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
                >
                  <X size={14} /> {/* Slightly smaller icon */}
                </motion.button>
              </div>{" "}
              {/* Form */}{" "}
              <motion.div
                className="grid grid-cols-1 gap-3.5 md:gap-5 lg:grid-cols-2" // Adjusted gap
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* User ID */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                >
                  <label className="mb-1 flex items-center gap-1.5 text-[13px] font-medium">
                    {" "}
                    {/* Adjusted margin and text */}
                    <User size={13} style={{ color: iconColor }} />
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
                        "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut (was 6px)
                    }}
                    placeholder="Enter your session identifier"
                  />
                  {errors.userId && (
                    <motion.p
                      className="mt-1 text-[11px] text-red-400/90" // Adjusted styles
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {errors.userId}
                    </motion.p>
                  )}
                </motion.div>
                {/* User Name */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                >
                  <label className="mb-1 flex items-center gap-1.5 text-[13px] font-medium">
                    {" "}
                    {/* Adjusted margin and text */}
                    <MessageCircle size={13} style={{ color: iconColor }} />
                    Display Name{" "}
                    <span className="text-[11px] opacity-50">(Optional)</span>
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
                        "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut (was 6px)
                    }}
                    placeholder="How should we address you?"
                  />
                </motion.div>{" "}
                {/* Language Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                  className="lg:col-span-1"
                >
                  <CustomDropdown
                    label="Conversation Language"
                    icon={<Globe size={13} style={{ color: iconColor }} />}
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
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                  className="lg:col-span-1"
                >
                  <CustomDropdown
                    label="Voice Character"
                    icon={<Mic size={13} style={{ color: iconColor }} />}
                    value={config.voice}
                    options={VOICE_MODELS}
                    onChange={(value) =>
                      setConfig({ ...config, voice: value as VoiceModel })
                    }
                    error={errors.voice}
                    placeholder="Choose your AI voice"
                  />{" "}
                </motion.div>{" "}
                {/* Real-Time Mode Toggle */}{" "}
                <motion.div
                  className="flex items-center justify-between lg:col-span-1" // Ensure it takes full width on smaller, half on large
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
                >
                  <label className="flex items-center gap-1.5 text-[13px] font-medium">
                    <Radio size={13} style={{ color: iconColor }} />{" "}
                    {/* Adjusted icon size */}
                    Real-Time Mode
                    <span className="text-[11px] opacity-50">
                      (RT Demo)
                    </span>{" "}
                    {/* Adjusted text size */}
                  </label>
                  <motion.button
                    onClick={() => setRtModeEnabled(!rtModeEnabled)}
                    className="relative h-5 w-10 transition-all duration-200 ease-out" // Adjusted size
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
                      backgroundColor: rtModeEnabled
                        ? `${ThemeColors.accent}25`
                        : "rgba(128,128,128,0.15)",
                      border: `1px solid ${rtModeEnabled ? `${ThemeColors.accent}B3` : "rgba(128,128,128,0.2)"}`,
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.div
                      className="absolute top-px h-4 w-4" // Adjusted size
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 1.5px) 0, 100% 1.5px, 100% 100%, 1.5px 100%, 0 calc(100% - 1.5px))", // Sharper cut (was 2px)
                        backgroundColor: rtModeEnabled
                          ? ThemeColors.accent
                          : "#888",
                      }}
                      animate={{
                        x: rtModeEnabled ? 22 : 1.5, // Adjusted travel for w-10, knob w-4
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 600,
                        damping: 25,
                      }}
                    />
                  </motion.button>
                </motion.div>{" "}
                {/* RT Mode Description */}
                {rtModeEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }} // Faster transition
                    className="col-span-full"
                  >
                    <div
                      className="rounded border p-2.5 text-[13px]" // Adjusted padding and text
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
                        backgroundColor: `${ThemeColors.accent}0A`, // More subtle background
                        border: `1px solid ${ThemeColors.accent}26`,
                      }}
                    >
                      <p
                        className={` ${isDark ? "text-white/70" : "text-black/70"}`} // Adjusted opacity
                      >
                        <strong>Real-Time Mode:</strong> Uses optimized
                        processing for ultra-low latency conversations. Advanced
                        model selection is disabled as RT mode uses
                        pre-configured models for best performance.
                      </p>
                    </div>
                  </motion.div>
                )}
                {/* Assistant Persona Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                  className="lg:col-span-2"
                >
                  <div className="mb-1.5">
                    {" "}
                    {/* Adjusted margin */}
                    <label className="flex items-center gap-1.5 text-[13px] font-medium">
                      <FileText size={13} style={{ color: iconColor }} />
                      Select Assistant Persona
                    </label>
                    <p
                      className={`mt-0.5 text-[11px] ${isDark ? "text-white/40" : "text-black/40"}`} // Adjusted text and opacity
                    >
                      Choose a specialized AI assistant for your conversation
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {" "}
                    {/* Adjusted gap */}
                    {(
                      Object.keys(ASSISTANT_PERSONAS) as AssistantPersona[]
                    ).map((key) => {
                      const persona = ASSISTANT_PERSONAS[key];
                      const isSelected =
                        config.instructions?.trim() ===
                        persona.instruction.trim();

                      return (
                        <PersonaButton
                          key={persona.id}
                          persona={persona}
                          isSelected={isSelected}
                          onClick={() =>
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
                  <div className="mt-3.5 border-t border-[rgba(128,128,128,0.15)] pt-3.5">
                    {" "}
                    {/* Adjusted margin and border */}
                    <div className="mb-1">
                      {" "}
                      {/* Adjusted margin */}
                      <label className="flex items-center gap-1.5 text-[13px] font-medium">
                        <FileText size={13} style={{ color: iconColor }} />
                        Custom Instructions
                        <span className="text-[11px] opacity-50">
                          (Optional)
                        </span>
                      </label>
                      <p
                        className={`mt-0.5 text-[11px] ${isDark ? "text-white/40" : "text-black/40"}`} // Adjusted text and opacity
                      >
                        Or provide your own specific instructions for the AI
                        assistant
                      </p>
                    </div>
                    <textarea
                      value={
                        Object.values(ASSISTANT_PERSONAS).some(
                          (p) =>
                            p.instruction.trim() ===
                            config.instructions?.trim(),
                        )
                          ? ""
                          : (config.instructions ?? "")
                      }
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          instructions: e.target.value,
                        })
                      }
                      className={`w-full resize-none rounded-none border bg-transparent px-3 py-1.5 text-[13px] backdrop-blur-sm transition-all duration-200 ease-out placeholder:text-[12px] placeholder:opacity-40 focus:outline-none focus:ring-0 ${
                        isDark
                          ? "border-white/08 text-white placeholder-white/40 hover:border-white/15 focus:border-white/25"
                          : "border-black/08 text-black placeholder-black/40 hover:border-black/15 focus:border-black/25"
                      }`}
                      style={{
                        height: "80px", // Adjusted height (h-20)
                        clipPath:
                          "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
                      }}
                      placeholder="Enter custom instructions for how the AI should behave..."
                    />
                  </div>{" "}
                </motion.div>
                {/* Advanced Configuration Section - Hidden in RT Mode */}
                {!rtModeEnabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.3, ease: "easeOut" }}
                    className="lg:col-span-2"
                  >
                    <div className="mb-2.5 flex items-center justify-between">
                      {" "}
                      {/* Adjusted margin */}
                      <label className="flex items-center gap-1.5 text-[13px] font-medium">
                        <Settings size={13} style={{ color: iconColor }} />
                        Advanced Configuration
                        <span className="text-[11px] opacity-50">
                          (Optional)
                        </span>
                      </label>
                      <motion.button
                        onClick={() => setAdvancedEnabled(!advancedEnabled)}
                        className="relative h-5 w-10 transition-all duration-200 ease-out" // Adjusted size
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))", // Sharper cut
                          backgroundColor: advancedEnabled
                            ? `${ThemeColors.accent}25`
                            : "rgba(128,128,128,0.15)",
                          border: `1px solid ${advancedEnabled ? `${ThemeColors.accent}B3` : "rgba(128,128,128,0.2)"}`,
                        }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <motion.div
                          className="absolute top-px h-4 w-4" // Adjusted size
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 1.5px) 0, 100% 1.5px, 100% 100%, 1.5px 100%, 0 calc(100% - 1.5px))", // Sharper cut (was 2px)
                            backgroundColor: advancedEnabled
                              ? ThemeColors.accent
                              : "#888",
                          }}
                          animate={{
                            x: advancedEnabled ? 22 : 1.5, // Adjusted travel
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 25,
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
                          transition={{ duration: 0.25, ease: "easeOut" }} // Faster transition
                          className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5" // Adjusted gap
                        >
                          {/* STT Model Toggle & Dropdown */}
                          <ModelToggleButton
                            label="STT Model"
                            icon={<Volume2 size={18} />}
                            isEnabled={sttModelEnabled}
                            setIsEnabled={setSttModelEnabled}
                            selectedModel={config.stt_model ?? ""}
                          />
                          {sttModelEnabled && (
                            <CustomDropdown
                              label="Select STT Model"
                              icon={
                                <Volume2
                                  size={13}
                                  style={{ color: iconColor }}
                                />
                              }
                              value={config.stt_model ?? ""}
                              options={STT_MODELS}
                              onChange={(value) =>
                                setConfig({ ...config, stt_model: value })
                              }
                              placeholder="Choose STT model"
                            />
                          )}
                          {/* LLM Model Toggle & Dropdown */}
                          <ModelToggleButton
                            label="LLM Model"
                            icon={<Brain size={18} />}
                            isEnabled={llmModelEnabled}
                            setIsEnabled={setLlmModelEnabled}
                            selectedModel={config.llm_model ?? ""}
                          />
                          {llmModelEnabled && (
                            <CustomDropdown
                              label="Select LLM Model"
                              icon={
                                <Brain size={13} style={{ color: iconColor }} />
                              }
                              value={config.llm_model ?? ""}
                              options={LLM_MODELS}
                              onChange={(value) =>
                                setConfig({ ...config, llm_model: value })
                              }
                              placeholder="Choose LLM model"
                            />
                          )}
                          {/* TTS Model Toggle & Dropdown */}
                          <ModelToggleButton
                            label="TTS Model"
                            icon={<Mic size={18} />}
                            isEnabled={ttsModelEnabled}
                            setIsEnabled={setTtsModelEnabled}
                            selectedModel={config.tts_model ?? ""}
                          />
                          {ttsModelEnabled && (
                            <CustomDropdown
                              label="Select TTS Model"
                              icon={
                                <Mic size={13} style={{ color: iconColor }} />
                              }
                              value={config.tts_model ?? ""}
                              options={TTS_MODELS}
                              onChange={(value) =>
                                setConfig({ ...config, tts_model: value })
                              }
                              placeholder="Choose TTS model"
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
              {/* Action Buttons */}
              <motion.div
                className="mt-6 flex flex-col items-center justify-end gap-2.5 pt-5 sm:flex-row md:mt-8" // Adjusted margin and gap
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
              >
                <motion.button
                  onClick={onClose}
                  className="w-full rounded-none border px-4 py-2 text-[13px] font-medium transition-all duration-200 ease-out sm:w-auto"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.2)",
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                    backgroundColor: "transparent",
                  }}
                  whileHover={{
                    borderColor: isDark
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.4)",
                    color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
                    scale: 1.015,
                  }}
                  whileTap={{ scale: 0.985 }} // Less tap scale
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-none border border-transparent px-4 py-2 text-[13px] font-medium text-white transition-all duration-200 ease-out sm:w-auto"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                    background: `linear-gradient(45deg, ${ThemeColors.accent}E6, ${ThemeColors.accent}B3)`, // Slightly less intense gradient
                    boxShadow: `0 4px 12px ${ThemeColors.accent}30`, // Subtler shadow
                  }}
                  whileHover={{
                    scale: 1.015,
                    boxShadow: `0 6px 16px ${ThemeColors.accent}40`,
                  }}
                  whileTap={{ scale: 0.985 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <motion.div
                        className="mr-2 h-3.5 w-3.5 rounded-full border-2 border-white/50 border-t-white" // Adjusted spinner size
                        animate={{ rotate: 360 }}
                        transition={{
                          loop: Infinity,
                          ease: "linear",
                          duration: 0.8,
                        }}
                      />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Start Conversation
                      <ArrowRight size={14} className="ml-1.5" />{" "}
                      {/* Adjusted icon size */}
                    </div>
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
