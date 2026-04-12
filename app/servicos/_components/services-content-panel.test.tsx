import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesContentPanel } from "./services-content-panel";

describe("ServicesContentPanel", () => {
  it("renderiza conteudo correspondente da aba ativa", () => {
    render(<ServicesContentPanel activeTab="meus-cartoes" />);

    expect(screen.getByText("Gerencie seus cartoes fisico e digital com rapidez.")).toBeInTheDocument();
    expect(screen.getByLabelText("Emprestimo")).toBeInTheDocument();
    expect(screen.getByLabelText("Meus cartoes")).toBeInTheDocument();
  });
});
