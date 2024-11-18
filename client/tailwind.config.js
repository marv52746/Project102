/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",

        "text-primary": "rgba(var(--text-primary))",
        "text-secondary": "rgba(var(--text-secondary))",

        "side-active": "rgba(var(--side-active))",
        "sidetext-active": "rgba(var(--sidetext-active))",

        border: "rgba(var(--border))",
        "background-head": "rgba(var(--background-head))",
      },
    },
  },
  plugins: [],
};
