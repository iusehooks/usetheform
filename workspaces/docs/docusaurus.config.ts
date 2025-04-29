import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";
import tailwindPlugin from "./plugins/tailwind-config"; // add this
import customAlias from "./plugins/custom-alias"; // add this

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Usetheform",
  tagline: "An easy way to build forms in React",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://iusehooks.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/usetheform/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "iusehooks", // Usually your GitHub org/user name.
  projectName: "usetheform", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  themes: ["@docusaurus/theme-live-codeblock"],

  plugins: [customAlias, tailwindPlugin, "@docusaurus/plugin-content-pages", [
    require.resolve("docusaurus-plugin-search-local"),
    {
      hashed: true,
      indexBlog: false,
      indexPages: false,
      indexDocs: true,
      docsRouteBasePath: "/",  // This can remain '/' if docs should be the root path, otherwise adjust it.
    },
  ]],

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs", // Folder where index.mdx lives
          routeBasePath: "/", // ✅ This makes /docs/index.mdx serve at "/"
          sidebarPath: "./sidebars.ts",
        },
        blog: false, // 👈 Disable the blog
        pages: false, // 👈 Disable custom pages (src/pages)
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/logo.png",
    navbar: {
      logo: {
        alt: "Usetheform",
        src: "img/logo.png",
      },
      items: [
        {
          href: "https://github.com/iusehooks/usetheform",
          label: "GitHub",
          position: "right",
        },
        {
          type: 'search',
          position: 'right',
        }
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
