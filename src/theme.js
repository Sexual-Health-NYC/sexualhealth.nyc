export const theme = {
  colors: {
    // Primary (brand)
    primary: "#7b2cbf",
    primaryLight: "#9d4edd",
    primaryDark: "#5a189a",

    // Accent
    accent: "#ff006e",

    // Service colors - accessible pairs (light bg + dark text)
    stiTestingBg: "#ebdff5",
    stiTestingText: "#561f86",
    hivTestingBg: "#ebdff5",
    hivTestingText: "#561f86",
    prepBg: "#d9eff7",
    prepText: "#00698b",
    pepBg: "#fbe1e3",
    pepText: "#a12831",
    contraceptionBg: "#daf2ec",
    contraceptionText: "#047558",
    abortionBg: "#ffe9e9",
    abortionText: "#ad4949",
    lgbtqBg: "#ffd9e9",
    lgbtqText: "#b3004d",

    // Neutrals
    textPrimary: "#212529",
    textSecondary: "#5a6570", // Changed from #6c757d for WCAG AA contrast (4.52:1)
    background: "#ffffff",
    surface: "#f8f9fa",
    border: "#dee2e6",

    // Status - WCAG AA compliant (white text on these backgrounds)
    open: "#047857", // 4.57:1 contrast with white (WCAG AA compliant)
    closed: "#64748b", // 4.76:1 contrast with white (WCAG AA compliant)
    verified: "#2563eb", // 5.17:1 contrast with white (WCAG AA compliant)

    // Map markers
    markerDefault: "#7b2cbf",
    markerSelected: "#0096c7",
    markerBorder: "#ffffff",
  },

  fonts: {
    family:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFamily: '"Montserrat", sans-serif',
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

  // Motion - warm & welcoming, gentle presence
  motion: {
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
      stagger: "50ms", // delay between sequential items
    },
    easing: {
      gentle: "cubic-bezier(0.4, 0, 0.2, 1)", // smooth deceleration
      bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)", // subtle overshoot
      enter: "cubic-bezier(0, 0, 0.2, 1)", // coming in
      exit: "cubic-bezier(0.4, 0, 1, 1)", // going out
    },
  },

  // Accessibility
  focus: {
    outline: `2px solid #7b2cbf`,
    outlineOffset: "2px",
  },
};

export default theme;
