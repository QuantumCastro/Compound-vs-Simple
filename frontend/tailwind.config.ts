import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
          raised: "rgb(var(--color-background-raised) / <alpha-value>)",
          muted: "rgb(var(--color-background-muted) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        accent: {
          simple: "rgb(var(--color-accent-simple) / <alpha-value>)",
          compound: "rgb(var(--color-accent-compound) / <alpha-value>)",
          highlight: "rgb(var(--color-accent-highlight) / <alpha-value>)",
          danger: "rgb(var(--color-accent-danger) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
          strong: "rgb(var(--color-border-strong) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "panel-soft":
          "0px 5px 15px rgba(18, 10, 34, 0.45), inset 0 1px 0 rgba(204, 180, 255, 0.12)",
      },
      keyframes: {
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "grow-area": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0 0 0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "draw-line": "draw-line 1.8s ease-in-out forwards",
        "grow-area": "grow-area 1.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
