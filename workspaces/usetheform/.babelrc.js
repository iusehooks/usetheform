let presets = [
  [
    "@babel/preset-env",
    {
      loose: true,
      modules: false,
      exclude: ["transform-async-to-generator", "transform-regenerator"],
      targets: {
        browsers: ["ie >= 11"]
      }
    }
  ],
  "@babel/preset-react"
];

let plugins = [["@babel/plugin-proposal-class-properties", { loose: true }]];
if (process.env.NODE_ENV === "test") {
  plugins.push("@babel/transform-modules-commonjs");
}

if (process.env.NODE_ENV === "development") {
  plugins = ["@babel/plugin-proposal-class-properties"];
  presets = ["@babel/preset-env", "@babel/preset-react"];
}

module.exports = {
  presets,
  plugins
};
