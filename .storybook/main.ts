import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.stories.@(ts|tsx|mdx)",
    "../components/**/*.stories.@(ts|tsx|mdx)",
    "../styles/**/*.stories.@(ts|tsx|mdx)"
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  staticDirs: ["../public"]
};

export default config;
