import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#06080f",
        graphite: "#0f141f",
        steel: "#7f8fa6",
        chrome: "#c3cfdb",
        blueprint: "#84b5e1",
        glow: "#9ed0ff"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"]
      },
      boxShadow: {
        glass: "0 30px 80px rgba(4, 8, 20, 0.52)",
        glow: "0 0 30px rgba(128, 181, 232, 0.3)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
