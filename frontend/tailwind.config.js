/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./store/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plex-sans)", "IBM Plex Sans", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"]
      },
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344"
        },
        ink: {
          950: "#050816",
          900: "#0b1020",
          800: "#111827",
          700: "#1f2937"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(15, 23, 42, 0.10)",
        glow: "0 12px 30px rgba(29, 78, 216, .18)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)",
        aurora: "linear-gradient(180deg, rgba(29,78,216,.08), transparent 30%), linear-gradient(135deg, rgba(15,23,42,.03), transparent)"
      }
    }
  },
  plugins: []
};
