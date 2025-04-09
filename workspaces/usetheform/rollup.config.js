import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import bundleSize from "rollup-plugin-bundle-size";
import copy from "rollup-plugin-copy";

const config = {
  input: "./src/index.js",
  output: {
    name: "UseTheForm",
    globals: {
      react: "React"
    },
    exports: "named"
  },
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    nodeResolve(),
    commonjs({
      include: /node_modules/
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    copy({
      targets: [{ src: "src/index.d.ts", dest: "build" }]
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    bundleSize()
  );
}

export default config;
