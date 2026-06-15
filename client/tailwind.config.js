/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0F172A",
          800: "#13203b",
          700: "#1e293b",
          600: "#334155",
        },
        indigo: {
          DEFAULT: "#6366F1",
          400: "#818cf8",
          500: "#6366F1",
          600: "#4f46e5",
        },
        emerald: {
          DEFAULT: "#10B981",
          400: "#34d399",
          500: "#10B981",
        },
        warmwhite: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.25), 0 8px 30px rgba(2,6,23,0.5)",
        lift: "0 12px 40px rgba(2,6,23,0.55)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
