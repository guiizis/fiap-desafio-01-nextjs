import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./select";

const options = [
  { value: "deposito", label: "Deposito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "pagamento", label: "Pagamento" },
] as const;

const meta = {
  title: "Components/UI/Select",
  component: Select,
  args: {
    label: "Tipo de transacao",
    name: "transaction-type",
    options,
    placeholder: "Selecione o tipo de transacao",
    defaultValue: "",
    disabled: false,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "deposito",
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    errorMessage: "Campo obrigatorio.",
  },
};
