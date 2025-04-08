const execSync = require("child_process").execSync;

const args = process.argv.slice(2);
const watch = !args.includes("--no-watch");

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });

console.log("\nBuilding UMD index.js ...");

if (watch) {
  exec("rollup -c -f umd -m inline -w src -o dev/index.js", {
    BABEL_ENV: "umd",
    NODE_ENV: "development"
  });
} else {
  exec("rollup -c -f umd -m inline -o dev/index.js", {
    BABEL_ENV: "umd",
    NODE_ENV: "development"
  });
}
