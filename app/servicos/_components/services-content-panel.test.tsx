import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesContentPanel } from "./services-content-panel";

describe("ServicesContentPanel", () => {
  it("renderiza conteudo correspondente da aba ativa", () => {
    render(<ServicesContentPanel activeTab="meus-cartoes" />);

    expect(screen.getByText("Gerenciamento de cartoes")).toBeInTheDocument();
    expect(screen.getByLabelText("Emprestimo")).toBeInTheDocument();
    expect(screen.getByLabelText("Meus cartoes")).toBeInTheDocument();
  });
});
