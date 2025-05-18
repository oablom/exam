/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Atkinson Hyperlegible'", "sans-serif"],
        hand: ["'Quicksand'", "sans-serif"],
      },
      colors: {
        scrapPink: "#FFD3DA",
        scrapBlue: "#D0EFFF",
        scrapYellow: "#FFF5C3",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
      animation: { wiggle: "wiggle 0.2s ease-in-out" },
    },
  },
  plugins: [],
};
