import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "#dde4dc" },
        { name: "surface", value: "#ffffff" }
      ]
    }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) =>
      createElement(
        "div",
        {
          className: "min-h-screen bg-background p-6 text-body"
        },
        createElement(Story)
      )
  ]
};

export default preview;
