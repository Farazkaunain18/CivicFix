import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F766E", // Teal
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          dark: "#115E59",
        },
        mint: {
          DEFAULT: "#CCFBF1",
          light: "#E6FFFA",
          dark: "#99F6E4",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#D97706",
        },
        surface: {
          light: "#F0FDFA",
          dark: "#0F172A",
          cardLight: "#FFFFFF",
          cardDark: "#1E293B",
        },
        urgency: {
          emergency: "#DC2626", // Red
          urgent: "#F97316",    // Orange
          soon: "#EAB308",      // Yellow-Amber
          homecare: "#16A34A",  // Green
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-gurmukhi)", "var(--font-noto-devanagari)", "system-ui", "sans-serif"],
        punjabi: ["var(--font-noto-gurmukhi)", "sans-serif"],
        hindi: ["var(--font-noto-devanagari)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 118, 110, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        card: "0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        floating: "0 20px 30px -10px rgba(15, 118, 110, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
