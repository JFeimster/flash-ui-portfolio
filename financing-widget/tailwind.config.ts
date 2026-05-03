import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c10",
        soot: "#0f1117",
        obsidian: "#07080b",
        bone: "#f4f1e9",
        gold: "#d4af37",
        violet: "#7c5cff"
      },
      boxShadow: {
        brutal: "0 0 0 2px rgba(244,241,233,0.18), 0 18px 60px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(212,175,55,0.22), 0 0 48px rgba(212,175,55,0.12)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      letterSpacing: {
        brutal: "0.02em",
        tighter2: "-0.04em"
      }
    }
  },
  plugins: []
} satisfies Config;
