/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          subtle: "#3b82f6",
          glow: "rgba(37, 99, 235, 0.15)",
        },
        obsidian: {
          950: "#08090d",
          900: "#10121a",
          850: "#141722",
          800: "#181c2a",
          700: "#22273b",
          600: "#2e344e",
        },
      },
    },
  },
  plugins: [],
};
