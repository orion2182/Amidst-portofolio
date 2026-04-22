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
        'dock': '0 10px 40px rgba(0,0,0,0.15)',
        'window': '0 30px 80px rgba(0,0,0,0.15)',
        'card': '0 8px 30px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'pill': '9999px',
      },
      fontSize: {
        'xxs': '10px',
        'xs': '11px',
        'sm': '12px',
        'md': '13px',
        'base': '14px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
        '5xl': '72px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      transitionTimingFunction: {
        'macos': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backdropBlur: {
        'xs': '2px',
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
