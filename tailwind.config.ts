import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#11131a",
          soft: "#1b1e29",
          line: "#2a2e3d",
        },
        accent: {
          DEFAULT: "#ff5a4d",
          soft: "#ff7a6e",
        },
        cream: "#f6f4ef",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -18px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
