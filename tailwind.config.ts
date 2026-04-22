import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        neon: "var(--neon)",
        pink: "var(--pink)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      fontFamily: {
        space: ["var(--font-space)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 229, 200, 0.4), 0 0 20px rgba(0, 229, 200, 0.2)',
        'neon-pink': '0 0 10px rgba(232, 121, 176, 0.4), 0 0 20px rgba(232, 121, 176, 0.2)',
        'neon-purple': '0 0 10px rgba(123, 95, 220, 0.4), 0 0 20px rgba(123, 95, 220, 0.2)',
        'neon-lime': '0 0 10px rgba(168, 230, 61, 0.4), 0 0 20px rgba(168, 230, 61, 0.2)',
      },
      animation: {
        'glitch-scan': 'scanline 6s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
