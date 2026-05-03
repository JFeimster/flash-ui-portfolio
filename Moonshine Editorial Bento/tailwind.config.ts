import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        paper: "#ffffff",
        fog: "#f5f5f5",
        accent: "#2563eb"
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(26,26,26,0.08)",
        soft: "0 10px 30px rgba(26,26,26,0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
} satisfies Config;
