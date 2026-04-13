import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./alert";

const meta = {
  title: "Components/UI/Alert",
  component: Alert,
  args: {
    variant: "info",
    message: "Informacao processada com sucesso.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error", "success"],
    },
    dismissAfterMs: {
      control: "number",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Info: Story = {
  args: {
    variant: "info",
    message: "Action pending. Confira os dados antes de continuar.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    message: "Warning. Este dado pode exigir revisao.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    message: "Erro. Nao foi possivel concluir a operacao.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    message: "Sucesso. Operacao concluida.",
  },
};

export const AutoDismiss: Story = {
  args: {
    variant: "info",
    message: "Este alerta se fecha automaticamente.",
    dismissAfterMs: 2600,
  },
};
