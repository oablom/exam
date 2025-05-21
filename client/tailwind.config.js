/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "complete-pop": "completePop 0.5s ease-out",
        wiggle: "wiggle 0.2s ease-in-out",
      },
      keyframes: {
        completePop: {
          "0%": { transform: "scale(1)", backgroundColor: "#d1fae5" },
          "50%": { transform: "scale(2)", backgroundColor: "#6ee7b7" },
          "100%": { transform: "scale(1)", backgroundColor: "!inherit" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
      fontFamily: {
        sans: ["'Atkinson Hyperlegible'", "sans-serif"],
        hand: ["'Quicksand'", "sans-serif"],
      },
      colors: {
        scrapPink: "#FFD3DA",
        scrapBlue: "#D0EFFF",
        scrapYellow: "#FFF5C3",
      },
    },
  },
  plugins: [],
};
