export const ThemeColors = {
  dark: {
    background: "#09090B", // Slate black (Shade 950)
    text: "#FFFFFF", // Pure white for readability
    secondaryText: "#A1A1AA", // Muted gray (Zinc 400)
    border: "#27272A", // Subtle border (Zinc 800)
    subtleUI: "#18181B", // Card background (Zinc 900)
  },
  light: {
    background: "#FAFAFA", // Slightly off-white for better eye comfort
    text: "#111827", // Charcoal (Gray 900) for better contrast
    secondaryText: "#4B5563", // Deeper gray (Gray 600) for better readability
    border: "#E5E7EB", // Subtle gray border (Gray 200)
    subtleUI: "#F3F4F6", // Very light gray for subtle UI elements (Gray 100)
  },
  accent: "#FF3D71", // Updated to a vibrant magenta/hot pink
  secondaryAccents: {
    slate: "#64748B", // Slate blue-gray
    amber: "#F59E0B", // Amber for warnings/attention
    emerald: "#10B981", // Emerald green for success states
    cyan: "#06B6D4", // Added complementary cyan color
  },
  utility: {
    success: "#22C55E", // Success green
    error: "#EF4444", // Error red
    warning: "#F97316", // Warning orange
  },
};

export const ThemeTransitions = {
  default: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
};

// Tailwind-friendly color object for config
export const tailwindThemeColors = {
  background: ThemeColors.light.background,
  darkBackground: ThemeColors.dark.background,
  text: ThemeColors.light.text,
  darkText: ThemeColors.dark.text,
  secondaryText: ThemeColors.light.secondaryText,
  darkSecondaryText: ThemeColors.dark.secondaryText,
  border: ThemeColors.light.border,
  darkBorder: ThemeColors.dark.border,
  subtleUI: ThemeColors.light.subtleUI,
  darkSubtleUI: ThemeColors.dark.subtleUI,
  accent: ThemeColors.accent,
  slate: ThemeColors.secondaryAccents.slate,
  amber: ThemeColors.secondaryAccents.amber,
  emerald: ThemeColors.secondaryAccents.emerald,
  success: ThemeColors.utility.success,
  error: ThemeColors.utility.error,
  warning: ThemeColors.utility.warning,
};

export const GrainConfig = {
  default: {
    count: 1000,
    size: 0.011,
    opacity: 0.04,
  },
  active: {
    count: 1200,
    size: 0.015,
    opacity: 0.08,
  },
  transition: {
    duration: 150,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
