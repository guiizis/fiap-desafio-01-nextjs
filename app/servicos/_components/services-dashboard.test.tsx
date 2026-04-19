import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
  });
});
