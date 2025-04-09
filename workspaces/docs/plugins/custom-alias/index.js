import path from "path";
export default function () {
  return {
    name: "custom-alias",
    configureWebpack(config) {
      return {
        resolve: {
          alias: {
            ...config.resolve.alias,
            "@usetheform": path.resolve("./", "./../usetheform/src")
          }
        }
      };
    }
  };
}
