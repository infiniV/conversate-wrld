// Theme constants used throughout the application for consistent styling

export const ThemeColors = {
  // Primary accent color
  accent: "#FF3D71",

  // Secondary accent colors
  secondaryAccents: {
    cyan: "#0BC5EA",
    emerald: "#10B981",
    amber: "#F59E0B",
    violet: "#8B5CF6",
    slate: "#64748B",
  },

  // Light theme colors
  light: {
    background: "#FAFAFA",
    text: "#111827",
    secondaryText: "#4B5563",
    border: "rgba(0,0,0,0.1)",
    subtleUI: "#F3F4F6",
  },

  // Dark theme colors
  dark: {
    background: "#09090B",
    text: "#FFFFFF",
    secondaryText: "#9CA3AF",
    border: "rgba(255,255,255,0.1)",
    subtleUI: "#18181B",
  },
};

// Transition settings for smooth theme changes
export const ThemeTransitions = {
  default: "all 0.3s ease-in-out",
  fast: "all 0.15s ease-in-out",
  slow: "all 0.5s ease-in-out",
};
