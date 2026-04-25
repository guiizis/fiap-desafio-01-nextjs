import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createElement } from "react";
import { Logo } from "./logo";

const meta = {
  title: "Components/UI/Logo",
  component: Logo,
  args: {
    size: "md",
    variant: "full",
    tone: "light",
    alt: "McIntosh Bank",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["full", "symbol"],
    },
    tone: {
      control: "select",
      options: ["light", "secondary"],
    },
  },
  parameters: {
    backgrounds: {
      default: "logo-dark",
      values: [{ name: "logo-dark", value: "#000000" }],
    },
  },
  decorators: [
    (Story) =>
      createElement(
        "div",
        {
          className: "inline-flex rounded-md bg-black p-4",
        },
        createElement(Story)
      ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Symbol: Story = {
  args: {
    size: "md",
    variant: "symbol",
    alt: "Simbolo do McIntosh Bank",
  },
};

export const Secondary: Story = {
  args: {
    size: "md",
    variant: "full",
    tone: "secondary",
    alt: "McIntosh Bank verde",
  },
};
