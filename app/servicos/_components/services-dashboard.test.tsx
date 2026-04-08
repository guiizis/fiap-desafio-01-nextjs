import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesDashboard } from "./services-dashboard";

describe("ServicesDashboard", () => {
  it("renderiza estrutura base e troca conteudo ao mudar de aba", () => {
    render(<ServicesDashboard />);

    expect(screen.getByRole("heading", { name: "Ola, Joana! :)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Confira os servicos disponiveis", level: 2 })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Meus cartoes" }));

    expect(screen.getByRole("heading", { name: "Meus cartoes", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Gerenciamento de cartoes")).toBeInTheDocument();
  });
});
