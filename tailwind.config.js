/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
      colors: {
        // Primary palette - Neon Pink
        coral: {
          50: "#ffe5f0",
          100: "#ffcce2",
          200: "#ff99c5",
          300: "#FF73A5",
          400: "#FF4D8B",
          500: "#FF206E", // Main Cyber Pink
          600: "#E0185D",
          700: "#C0144D",
          800: "#A0103E",
          900: "#800B30",
        },
        // Secondary - Neon Cyan
        ocean: {
          50: "#e0fcf9",
          100: "#c2f9f2",
          200: "#85f3e5",
          300: "#91F4E7",
          400: "#6AF0DF",
          500: "#41EAD4", // Main Cyber Cyan
          600: "#35C6B3",
          700: "#2BA193",
          800: "#227D72",
          900: "#185850",
        },
        // Accent - Neon Volt
        amber: {
          50: "#fcffd6",
          100: "#fafdaj",
          200: "#fbfe8a",
          300: "#FDFF7A",
          400: "#FCFF4D",
          500: "#FBFF12", // Main Cyber Volt
          600: "#D5D90F",
          700: "#B0B30C",
          800: "#8A8C0A",
          900: "#656606",
        },
        // Glass surface colors
        glass: {
          light: "rgba(255, 255, 255, 0.15)",
          medium: "rgba(255, 255, 255, 0.25)",
          heavy: "rgba(255, 255, 255, 0.35)",
          dark: "rgba(0, 0, 0, 0.15)",
          darkMedium: "rgba(0, 0, 0, 0.25)",
          darkHeavy: "rgba(0, 0, 0, 0.35)",
        },
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "vinyl-spin": "vinylSpin 4s linear infinite",
        equalizer: "equalizer 0.8s ease-in-out infinite",
        wave: "wave 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 69, 0.3)" },
          "50%": {
            boxShadow:
              "0 0 40px rgba(255, 107, 69, 0.6), 0 0 60px rgba(255, 143, 110, 0.3)",
          },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        vinylSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        equalizer: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        wave: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.2)", opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "neon-coral": "0 0 30px rgba(255, 107, 69, 0.4)",
        "neon-ocean": "0 0 30px rgba(20, 184, 166, 0.4)",
        "neon-amber": "0 0 30px rgba(245, 158, 11, 0.4)",
        "inner-glow": "inset 0 0 30px rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
