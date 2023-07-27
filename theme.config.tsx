import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Portkey Developer Workshop</span>,
  project: {
    link: "https://github.com/Portkey-Wallet",
  },
  chat: {
    link: "https://discord.gg/EUBq3rHQhr",
  },
  footer: {
    text: "Portkey Developer Workshop",
  },
  docsRepositoryBase:
    "https://github.com/yongenportkey/portkey-workshop-contracts-demo/blob/main",
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Portkey Developer Workshop",
    };
  },
};

export default config;
