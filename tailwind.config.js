/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary (brand) - teal from logo
        primary: {
          DEFAULT: "#0D8078",
          light: "#4ECDC4",
          dark: "#047568",
        },
        accent: "#4ECDC4",

        // Service badge colors
        service: {
          "sti-bg": "#ebdff5",
          "sti-text": "#561f86",
          "hiv-bg": "#ebdff5",
          "hiv-text": "#561f86",
          "prep-bg": "#d9eff7",
          "prep-text": "#00698b",
          "pep-bg": "#fbe1e3",
          "pep-text": "#a12831",
          "contraception-bg": "#daf2ec",
          "contraception-text": "#047558",
          "abortion-bg": "#ffe9e9",
          "abortion-text": "#ad4949",
          "lgbtq-bg": "#ffd9e9",
          "lgbtq-text": "#b3004d",
        },

        // Child filter buttons
        "child-filter": {
          bg: "#f5f0f7",
          border: "#e0d4e8",
        },

        // Semantic/status colors
        open: "#047857",
        closed: "#64748b",
        verified: "#2563eb",

        // Map markers
        marker: {
          DEFAULT: "#0D8078",
          selected: "#4ECDC4",
          border: "#ffffff",
        },

        // Override gray scale for text
        gray: {
          50: "#f8f9fa", // surface
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6", // border
          400: "#ced4da",
          500: "#adb5bd",
          600: "#5a6570", // textSecondary (WCAG AA)
          700: "#495057",
          800: "#343a40",
          900: "#212529", // textPrimary
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: ["Montserrat", "sans-serif"],
      },

      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.1)",
        DEFAULT: "0 2px 4px rgba(0,0,0,0.2)",
        lg: "0 4px 8px rgba(0,0,0,0.3)",
      },

      transitionDuration: {
        fast: "150ms",
        DEFAULT: "250ms",
        slow: "350ms",
      },

      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        enter: "cubic-bezier(0, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },

      animation: {
        "fade-in": "fadeIn 250ms ease-out",
        "slide-in-right": "slideInRight 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-up": "slideInUp 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
