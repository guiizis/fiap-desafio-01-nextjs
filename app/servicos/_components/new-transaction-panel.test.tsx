import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewTransactionPanel } from "./new-transaction-panel";

describe("NewTransactionPanel", () => {
  it("renderiza estrutura base do formulario de transacao", () => {
    render(<NewTransactionPanel />);

    expect(screen.getByRole("heading", { name: "Nova transação", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tipo de transação" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Valor" })).toHaveValue("00,00");
    expect(screen.getByRole("button", { name: "Concluir transação" })).toBeInTheDocument();
  });

  it("aplica mascara de moeda ao digitar o valor", () => {
    render(<NewTransactionPanel />);

    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    fireEvent.change(amountInput, { target: { value: "123456" } });

    expect(amountInput).toHaveValue("1.234,56");
  });
});
