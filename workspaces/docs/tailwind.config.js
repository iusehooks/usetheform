/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'], // Add this line
  corePlugins: {
    preflight: false // Prevents Tailwind from conflicting with Docusaurus styles
  }
};
