/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Patrick Hand"', "cursive"],
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
