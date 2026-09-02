import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          sunken: "var(--bg-surface-sunken)",
        },
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
        },
        saffron: {
          DEFAULT: "var(--saffron)",
          deep: "var(--saffron-deep)",
        },
        "india-green": "var(--india-green)",
        navy: "var(--navy)",
        risk: {
          low: "var(--risk-low)",
          medium: "var(--risk-medium)",
          high: "var(--risk-high)",
          critical: "var(--risk-critical)",
        },
        border: {
          hairline: "var(--border-hairline)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Source Serif 4", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        dropdown: "0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

