// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Portkey Workshop",
  tagline: "Portkey Workshop documentation",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://portkey-workshop-contracts-demo.vercel.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Portkey Workshop",
        logo: {
          alt: "Portkey Workshop logo",
          src: "img/logo.svg",
        },
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Home",
            items: [
              {
                label: "Intro",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Token",
            items: [
              {
                label: "Create Token",
                to: "/docs/create-token",
              },
            ],
          },
          {
            title: "UI",
            items: [
              {
                label: "Portkey Sign In",
                to: "/docs/sign-in",
              },
              {
                label: "Get Balance",
                to: "/docs/get-balance",
              },
              {
                label: "Get NFT",
                to: "/docs/get-nft",
              },
            ],
          },
          {
            title: "Smart Contract",
            items: [
              {
                label: "Smart Contract",
                to: "/docs/smart-contract",
              },
              {
                label: "Frontend",
                to: "/docs/smart-contract-frontend",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Portkey.`,
      },
      prism: {
        additionalLanguages: ["csharp", "protobuf", "powershell"],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
    }),
};

module.exports = config;
