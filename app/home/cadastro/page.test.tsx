import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CadastroPage from "./page";

vi.mock("./_components/cadastro-form", () => ({
  CadastroForm: ({ layout }: { layout?: string }) => (
    <div data-testid="cadastro-form-mock">layout:{layout}</div>
  ),
}));

describe("CadastroPage", () => {
  it("renderiza o wrapper da pagina e passa layout='page' para o formulario", () => {
    render(<CadastroPage />);

    expect(screen.getByTestId("cadastro-form-mock")).toHaveTextContent("layout:page");
    expect(screen.getByRole("main").className).toContain("max-w-3xl");
  });
});