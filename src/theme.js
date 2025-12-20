export const theme = {
  colors: {
    // Primary (brand)
    primary: "#7b2cbf",
    primaryLight: "#9d4edd",
    primaryDark: "#5a189a",

    // Accent
    accent: "#ff006e",

    // Service colors
    stiTesting: "#7b2cbf",
    prep: "#0096c7",
    pep: "#e63946",
    contraception: "#06a77d",
    abortion: "#ff6b6b",
    lgbtq: "#ff006e",

    // Neutrals
    textPrimary: "#212529",
    textSecondary: "#5a6570", // Changed from #6c757d for WCAG AA contrast (4.52:1)
    background: "#ffffff",
    surface: "#f8f9fa",
    border: "#dee2e6",

    // Status
    open: "#10b981",
    closed: "#94a3b8",
    verified: "#3b82f6",

    // Map markers
    markerDefault: "#7b2cbf",
    markerSelected: "#0096c7",
    markerBorder: "#ffffff",
  },

  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "2rem", // 32px
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    12: "3rem", // 48px
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.1)",
    md: "0 2px 4px rgba(0,0,0,0.2)",
    lg: "0 4px 8px rgba(0,0,0,0.3)",
  },

  transitions: {
    fast: "0.15s",
    base: "0.2s",
    slow: "0.3s",
  },

  // Accessibility
  focus: {
    outline: `2px solid #7b2cbf`,
    outlineOffset: "2px",
  },
};

export default theme;
