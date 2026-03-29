import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  args: {
    children: "Abrir minha conta",
    variant: "solid",
    tone: "primary",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost"],
    },
    tone: {
      control: "select",
      options: ["primary", "secondary", "accent", "error"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SecondarySolid: Story = {
  args: {
    children: "Abrir minha conta",
    variant: "solid",
    tone: "secondary",
  },
};

export const SecondaryOutline: Story = {
  args: {
    children: "Já tenho conta",
    variant: "outline",
    tone: "secondary",
  },
};

export const AccentOutline: Story = {
  args: {
    children: "Conferir oferta",
    variant: "outline",
    tone: "accent",
  },
};

export const ErrorSolid: Story = {
  args: {
    children: "Excluir conta",
    variant: "solid",
    tone: "error",
  },
};

export const ErrorGhost: Story = {
  args: {
    children: "Remover",
    variant: "ghost",
    tone: "error",
  },
};
