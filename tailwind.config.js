/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0B1C2C"
        },
        accent: {
          silver: "#C0C5CF",
          gold: "#D4AF37"
        },
        neutral: {
          dark: "#18181B",
          mid: "#3F3F46",
          light: "#F9FAFB"
        }
      },
      borderRadius: {
        pill: "9999px"
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        250: "250ms"
      }
    }
  },
  plugins: []
};

