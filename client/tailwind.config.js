/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "complete-pop": "completePop 0.5s ease-out",
        blink: "blink 1s step-end 2",
      },
      keyframes: {
        completePop: {
          "0%": { transform: "scale(1)", backgroundColor: "#d1fae5" },
          "50%": { transform: "scale(1.2)", backgroundColor: "#6ee7b7" },
          "100%": { transform: "scale(1)", backgroundColor: "inherit" },
        },
        blink: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
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
