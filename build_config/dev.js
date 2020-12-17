const execSync = require("child_process").execSync;

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });

console.log("\nBuilding UMD index.js ...");

exec("rollup -c -f umd -m inline -w src -o dev/index.js", {
  BABEL_ENV: "umd",
  NODE_ENV: "development"
});
