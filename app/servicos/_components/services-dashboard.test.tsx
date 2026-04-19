import { fireEvent, render, screen, within } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ServicesDashboard } from "./services-dashboard";

const statementEntries = [
  { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
  { id: "2", month: "Novembro", type: "Deposito", amountInCents: 10000, date: "21/11/2022" },
  { id: "3", month: "Novembro", type: "Deposito", amountInCents: 5000, date: "21/11/2022" },
  { id: "4", month: "Novembro", type: "Transferencia", amountInCents: -50000, date: "21/11/2022" },
] as const;

describe("ServicesDashboard", () => {
  it("renderiza estrutura base com painel de nova transacao e abas indisponiveis", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    expect(screen.getByRole("heading", { name: "Ola, Joana! :)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nova transação", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir transação" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Transferencias" })).toBeDisabled();
  });

  it("alterna visibilidade do saldo", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Ocultar saldo" }));
    expect(screen.getByText("R$ ******")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mostrar saldo" }));
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
  });

  it("atualiza o saldo ao concluir deposito e transferencia", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(typeSelect, { target: { value: "deposito" } });
    fireEvent.change(amountInput, { target: { value: "10000" } });
    fireEvent.click(submitButton);
    expect(screen.getByText("R$ 2.600,00")).toBeInTheDocument();

    fireEvent.change(typeSelect, { target: { value: "transferencia" } });
    fireEvent.change(amountInput, { target: { value: "5000" } });
    fireEvent.click(submitButton);
    expect(screen.getByText("R$ 2.550,00")).toBeInTheDocument();
  });

  it("adiciona novo lancamento no extrato ao concluir transacao", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18T15:00:00.000Z"));

    try {
      render(
        <ServicesDashboard
          userFirstName="Joana"
          balanceInCents={250000}
          statementEntries={statementEntries}
        />
      );

      const statementPanel = screen.getByLabelText("Extrato da conta");
      const submitButton = screen.getByRole("button", { name: "Concluir transação" });
      const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
      const amountInput = screen.getByRole("textbox", { name: "Valor" });

      expect(within(statementPanel).getAllByRole("listitem")).toHaveLength(4);

      fireEvent.change(typeSelect, { target: { value: "deposito" } });
      fireEvent.change(amountInput, { target: { value: "12345" } });
      fireEvent.click(submitButton);

      const statementItems = within(statementPanel).getAllByRole("listitem");
      expect(statementItems).toHaveLength(5);
      expect(within(statementItems[0]).getByText("Abril")).toBeInTheDocument();
      expect(within(statementItems[0]).getByText("18/04/2026")).toBeInTheDocument();
      expect(within(statementItems[0]).getByText("Deposito")).toBeInTheDocument();
      expect(within(statementItems[0]).getByText(/123,45/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("ajusta o saldo ao excluir lancamento selecionado do extrato", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    const statementPanel = screen.getByLabelText("Extrato da conta");
    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });

    const transferEntry = screen.getByText("-R$ 500,00").closest("li");
    if (!transferEntry) {
      throw new Error("Lancamento de transferencia nao encontrado");
    }

    fireEvent.click(transferEntry);
    fireEvent.click(deleteButton);
    expect(screen.getByText("R$ 3.000,00")).toBeInTheDocument();
    expect(within(statementPanel).queryByText("-R$ 500,00")).not.toBeInTheDocument();

    const depositEntry = screen.getByText("R$ 150,00").closest("li");
    if (!depositEntry) {
      throw new Error("Lancamento de deposito nao encontrado");
    }

    fireEvent.click(depositEntry);
    fireEvent.click(deleteButton);
    expect(screen.getByText("R$ 2.850,00")).toBeInTheDocument();
    expect(within(statementPanel).queryByText("R$ 150,00")).not.toBeInTheDocument();
  });

  it("ajusta o saldo ao editar deposito e transferencia usando valor positivo", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });

    const depositEntry = screen.getByText("R$ 150,00").closest("li");
    if (!depositEntry) {
      throw new Error("Lancamento de deposito nao encontrado");
    }

    fireEvent.click(depositEntry);
    fireEvent.click(editButton);

    const depositInput = screen.getByRole("textbox", { name: "Valor do lancamento" });
    fireEvent.change(depositInput, { target: { value: "20000" } });
    fireEvent.keyDown(depositInput, { key: "Enter" });

    expect(screen.getByText("R$ 2.550,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 200,00")).toBeInTheDocument();

    const transferEntry = screen.getByText("-R$ 500,00").closest("li");
    if (!transferEntry) {
      throw new Error("Lancamento de transferencia nao encontrado");
    }

    fireEvent.click(transferEntry);
    fireEvent.click(editButton);

    const transferInput = screen.getByRole("textbox", { name: "Valor do lancamento" });
    fireEvent.change(transferInput, { target: { value: "70000" } });
    fireEvent.keyDown(transferInput, { key: "Enter" });

    expect(screen.getByText("R$ 2.350,00")).toBeInTheDocument();
    expect(screen.getByText("-R$ 700,00")).toBeInTheDocument();
  });

  it("bloqueia transferencia que negativaria o saldo e exibe alerta", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(typeSelect, { target: { value: "transferencia" } });
    fireEvent.change(amountInput, { target: { value: "300000" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Saldo insuficiente para concluir a transferência."
    );
    expect(within(screen.getByLabelText("Extrato da conta")).getAllByRole("listitem")).toHaveLength(4);
  });

  it("cria lancamento com fallback de id quando randomUUID nao esta disponivel", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18T15:00:00.000Z"));
    vi.stubGlobal("crypto", { randomUUID: undefined } as Crypto);

    try {
      render(
        <ServicesDashboard
          userFirstName="Joana"
          balanceInCents={250000}
          statementEntries={statementEntries}
        />
      );

      const submitButton = screen.getByRole("button", { name: "Concluir transação" });
      const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
      const amountInput = screen.getByRole("textbox", { name: "Valor" });

      fireEvent.change(typeSelect, { target: { value: "deposito" } });
      fireEvent.change(amountInput, { target: { value: "1000" } });
      fireEvent.click(submitButton);

      expect(screen.getByText("R$ 2.510,00")).toBeInTheDocument();
      expect(within(screen.getByLabelText("Extrato da conta")).getAllByRole("listitem")).toHaveLength(5);
    } finally {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });

  it("nao duplica ajuste de saldo ao excluir transferencia no StrictMode", () => {
    render(
      <StrictMode>
        <ServicesDashboard
          userFirstName="Joana"
          balanceInCents={250000}
          statementEntries={statementEntries}
        />
      </StrictMode>
    );

    const submitButton = screen.getByRole("button", { name: "Concluir transação" });
    const typeSelect = screen.getByRole("combobox", { name: "Tipo de transação" });
    const amountInput = screen.getByRole("textbox", { name: "Valor" });

    fireEvent.change(typeSelect, { target: { value: "transferencia" } });
    fireEvent.change(amountInput, { target: { value: "7000" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("R$ 2.430,00")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });
    const transferEntry = screen.getByText("-R$ 70,00").closest("li");
    if (!transferEntry) {
      throw new Error("Lancamento de transferencia nao encontrado");
    }

    fireEvent.click(transferEntry);
    fireEvent.click(deleteButton);

    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
  });
});
