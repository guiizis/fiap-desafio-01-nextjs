import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewTransactionPanel } from "./new-transaction-panel";

describe("NewTransactionPanel", () => {
  it("renderiza estrutura base do formulario e comeca com botao desabilitado", () => {
    render(<NewTransactionPanel />);

    expect(
      screen.getByRole("heading", { name: "Nova transação", level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Tipo de transação" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Valor" })).toHaveValue("00,00");
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Concluir transação" })
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

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(amountInput, { target: { value: "0" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(amountInput, { target: { value: "1" } });
    expect(submitButton).toBeEnabled();
  });

  it("mantem submit desabilitado quando data esta fora do intervalo permitido", () => {
    render(<NewTransactionPanel />);

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    const dateInput = screen.getByLabelText("Data");

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    fireEvent.change(amountInput, { target: { value: "100" } });
    fireEvent.change(dateInput, { target: { value: "275760-04-19" } });
    fireEvent.blur(dateInput);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Informe uma data entre/i)).toBeInTheDocument();
  });

  it("previne submit padrao do formulario", () => {
    render(<NewTransactionPanel />);

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
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

  it("ignora submit quando tipo da transacao e invalido ou vazio", () => {
    const onSubmitTransaction = vi.fn();

    render(<NewTransactionPanel onSubmitTransaction={onSubmitTransaction} />);

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    const form = submitButton.closest("form");

    if (!form) {
      throw new Error("Formulario nao encontrado");
    }

    fireEvent.change(amountInput, { target: { value: "100" } });
    fireEvent.submit(form);

    expect(onSubmitTransaction).not.toHaveBeenCalled();
  });

  it("ignora valor invalido no select e mantem ultimo tipo valido", () => {
    render(<NewTransactionPanel />);

    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const invalidOption = document.createElement("option");
    invalidOption.value = "pix";
    invalidOption.textContent = "Pix";
    typeSelect.appendChild(invalidOption);

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    expect(typeSelect).toHaveValue("deposito");

    fireEvent.change(typeSelect, { target: { value: "pix" } });
    expect(typeSelect).toHaveValue("deposito");
  });

  it("envia o valor em centavos e reseta o formulario no submit valido", () => {
    const onSubmitTransaction = vi.fn();

    render(<NewTransactionPanel onSubmitTransaction={onSubmitTransaction} />);

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });
    const dateInput = screen.getByLabelText("Data");

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    fireEvent.change(amountInput, { target: { value: "123456" } });
    fireEvent.change(dateInput, { target: { value: "2026-04-19" } });
    fireEvent.click(submitButton);

    expect(onSubmitTransaction).toHaveBeenCalledWith({
      type: "deposito",
      amountInCents: 123456,
      transactionDate: "2026-04-19",
    });
    expect(typeSelect).toHaveValue("");
    expect(amountInput).toHaveValue("00,00");
  });

  it("mostra alerta de erro e mantem os dados quando transacao e bloqueada", () => {
    const onSubmitTransaction = vi.fn().mockReturnValue({
      ok: false,
      message: "Saldo insuficiente para concluir a transferência.",
    });

    render(<NewTransactionPanel onSubmitTransaction={onSubmitTransaction} />);

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(typeSelect, { target: { value: "transferencia" } });
    fireEvent.change(amountInput, { target: { value: "300000" } });
    fireEvent.click(submitButton);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Saldo insuficiente para concluir a transferência."
    );
    expect(typeSelect).toHaveValue("transferencia");
    expect(amountInput).toHaveValue("3.000,00");
  });
});
