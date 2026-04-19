import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ServicesContentPanel } from "./services-content-panel";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("ServicesContentPanel", () => {
  it("renderiza conteudo correspondente da aba ativa", () => {
    render(<ServicesContentPanel activeTab="meus-cartoes" />);

    expect(screen.getByText("Gerencie seus cartoes fisico e digital com rapidez.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Abrir aviso do servico Empr/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Abrir aviso do servico Meus cart/i })).toBeInTheDocument();
  });

  it("abre modal de ainda em construcao e volta para /servicos", () => {
    replaceMock.mockClear();

    render(<ServicesContentPanel activeTab="meus-cartoes" />);

    const [openWarningButton] = screen.getAllByRole("button", {
      name: /Abrir aviso do servico/i,
    });

    fireEvent.click(openWarningButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Ainda em construcao")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Voltar para servicos" }));

    expect(replaceMock).toHaveBeenCalledWith("/servicos");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
