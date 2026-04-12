import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewTransactionPanel } from "./new-transaction-panel";

describe("NewTransactionPanel", () => {
  it("renderiza estrutura base do formulario e comeca com botao desabilitado", () => {
    render(<NewTransactionPanel />);

    expect(
      screen.getByRole("heading", { name: "Nova transa\u00e7\u00e3o", level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Tipo de transa\u00e7\u00e3o" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Valor" })).toHaveValue("00,00");
    expect(
      screen.getByRole("button", { name: "Concluir transa\u00e7\u00e3o" })
    ).toBeDisabled();
  });

  it("aplica mascara de moeda ao digitar o valor", () => {
    render(<NewTransactionPanel />);

    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    fireEvent.change(amountInput, { target: { value: "123456" } });

    expect(amountInput).toHaveValue("1.234,56");
  });

  it("habilita botao somente quando tipo e valor sao validos", () => {
    render(<NewTransactionPanel />);

    const submitButton = screen.getByRole("button", { name: "Concluir transa\u00e7\u00e3o" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transa\u00e7\u00e3o" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(amountInput, { target: { value: "0" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(amountInput, { target: { value: "1" } });
    expect(submitButton).toBeEnabled();
  });

  it("previne submit padrao do formulario", () => {
    render(<NewTransactionPanel />);

    const submitButton = screen.getByRole("button", { name: "Concluir transa\u00e7\u00e3o" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transa\u00e7\u00e3o" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    const form = submitButton.closest("form");

    if (!form) {
      throw new Error("Formulario nao encontrado");
    }

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    fireEvent.change(amountInput, { target: { value: "999" } });

    const submitEvent = createEvent.submit(form, { cancelable: true });
    fireEvent(form, submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
  });
});
