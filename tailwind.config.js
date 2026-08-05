/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      screens: {
        xl: "1290px",
      },
      colors: {
        navy: "#0B1F3A",
        charcoal: "#1C1F26",
        "electric-blue": "#0A6CFF",
        "light-grey": "#F4F5F7",
      },
      fontFamily: {
        heading: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-open-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
