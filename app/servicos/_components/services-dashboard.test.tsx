import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesDashboard } from "./services-dashboard";

describe("ServicesDashboard", () => {
  it("renderiza estrutura base com painel de nova transacao e abas indisponiveis", () => {
    render(<ServicesDashboard />);

    expect(screen.getByRole("heading", { name: "Ola, Joana! :)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nova transação", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir transação" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Transferencias" })).toBeDisabled();
  });

  it("alterna visibilidade do saldo", () => {
    render(<ServicesDashboard />);

    fireEvent.click(screen.getByRole("button", { name: "Ocultar saldo" }));
    expect(screen.getByText("R$ ******")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mostrar saldo" }));
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
  });
});
