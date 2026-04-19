import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalendarInput } from "./calendar-input";

describe("CalendarInput", () => {
  it("renderiza com range e propaga mudanca", () => {
    const onChange = vi.fn();

    render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="2026-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Data");
    expect(input).toHaveAttribute("min", "2025-01-01");
    expect(input).toHaveAttribute("max", "2026-12-31");

    fireEvent.change(input, { target: { value: "2026-04-20" } });
    expect(onChange).toHaveBeenCalledWith("2026-04-20");
  });

  it("mostra erro para data fora do intervalo e notifica validade", () => {
    const onValidityChange = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="2026-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
        onValidityChange={onValidityChange}
      />
    );

    expect(onValidityChange).toHaveBeenLastCalledWith(true);

    rerender(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="275760-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
        onValidityChange={onValidityChange}
      />
    );

    fireEvent.blur(screen.getByLabelText("Data"));

    expect(onValidityChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText(/Informe uma data entre/i)).toBeInTheDocument();
  });
});
