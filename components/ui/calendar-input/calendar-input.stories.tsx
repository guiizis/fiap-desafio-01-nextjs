import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getDefaultTransactionDate, getTransactionDateRange } from "../../../app/servicos/_utils/transaction-date";
import { CalendarInput } from "./calendar-input";

const calendarRange = getTransactionDateRange();

const meta = {
  title: "Components/UI/CalendarInput",
  component: CalendarInput,
  args: {
    label: "Data",
    name: "transaction-date",
    value: getDefaultTransactionDate(),
    minDate: calendarRange.minDate,
    maxDate: calendarRange.maxDate,
    disabled: false,
    required: true,
    onChange: () => {},
  },
} satisfies Meta<typeof CalendarInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithExternalError: Story = {
  args: {
    errorMessage: "Campo obrigatorio.",
  },
};
