module.exports = {
  plugins: [
    require("postcss-import"), // If you're using postcss-import
    require("@tailwindcss/postcss"), // Add this line
    require("autoprefixer") // If you're using autoprefixer,
  ]
};
