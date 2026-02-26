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
        display: ["Bricolage Grotesque", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        // Primary — Burnt Terracotta
        terracotta: {
          50: "#fef3ee",
          100: "#fce4d6",
          200: "#f9c5a9",
          300: "#f5a07a",
          400: "#f07d52",
          500: "#E85D3A",
          600: "#d04425",
          700: "#ad3420",
          800: "#8a2c22",
          900: "#70271f",
        },
        // Secondary — Forest Teal
        teal: {
          50: "#effef8",
          100: "#c9fded",
          200: "#96f9dd",
          300: "#56eecb",
          400: "#24d9b3",
          500: "#2D7D6F",
          600: "#069969",
          700: "#067a57",
          800: "#096047",
          900: "#094f3c",
        },
        // Accent — Warm Gold
        gold: {
          50: "#fefaec",
          100: "#fbf1c9",
          200: "#f7e28f",
          300: "#f2cc55",
          400: "#edb82e",
          500: "#D4A853",
          600: "#ba7618",
          700: "#9b5617",
          800: "#7e441a",
          900: "#68381a",
        },
        // Warm neutrals
        cream: {
          50: "#FDFCFA",
          100: "#FAF7F2",
          200: "#F0EBE3",
          300: "#E3DCD2",
          400: "#C9C0B4",
          500: "#AEA395",
          600: "#918578",
          700: "#6B6358",
          800: "#4A443C",
          900: "#2A2621",
        },
        espresso: {
          50: "#F5F0E8",
          100: "#E8E0D4",
          200: "#C4B9A8",
          300: "#9F917D",
          400: "#7A6D5B",
          500: "#5A5044",
          600: "#3D352C",
          700: "#252017",
          800: "#1A1714",
          900: "#110F0D",
        },
        // Glass surface colors
        glass: {
          light: "rgba(250, 247, 242, 0.6)",
          medium: "rgba(250, 247, 242, 0.75)",
          heavy: "rgba(250, 247, 242, 0.85)",
          dark: "rgba(26, 23, 20, 0.6)",
          darkMedium: "rgba(26, 23, 20, 0.75)",
          darkHeavy: "rgba(26, 23, 20, 0.85)",
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
        morph: "morph 12s ease-in-out infinite",
        groove: "groove 4s ease-in-out infinite",
        "tape-spin": "tapeSpin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 93, 58, 0.3)" },
          "50%": {
            boxShadow:
              "0 0 40px rgba(232, 93, 58, 0.5), 0 0 60px rgba(212, 168, 83, 0.2)",
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
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 50% 70% 50%" },
          "75%": { borderRadius: "40% 60% 50% 40% / 60% 40% 60% 30%" },
        },
        groove: {
          "0%, 100%": { transform: "rotate(-2deg) scale(1)" },
          "50%": { transform: "rotate(2deg) scale(1.02)" },
        },
        tapeSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(42, 38, 33, 0.08)",
        "glass-lg": "0 25px 50px -12px rgba(42, 38, 33, 0.15)",
        "warm-glow": "0 0 30px rgba(232, 93, 58, 0.25)",
        "teal-glow": "0 0 30px rgba(45, 125, 111, 0.25)",
        "gold-glow": "0 0 30px rgba(212, 168, 83, 0.25)",
        "inner-glow": "inset 0 0 30px rgba(250, 247, 242, 0.05)",
      },
    },
  },
  plugins: [],
};
