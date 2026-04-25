import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "Components/UI/Input",
  component: Input,
  args: {
    label: "Nome",
    name: "nome",
    placeholder: "Digite seu nome completo",
    disabled: false,
    type: "text",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Email: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Digite seu email",
  },
};

export const Password: Story = {
  args: {
    label: "Senha",
    name: "senha",
    type: "password",
    placeholder: "Digite sua senha",
    inputClassName: "max-w-[165px]",
  },
};
