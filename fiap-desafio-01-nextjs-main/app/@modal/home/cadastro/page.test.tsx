import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import CadastroModalPage from "./page";

vi.mock("../../_components/modal-shell", () => ({
  ModalShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-shell-mock">{children}</div>
  ),
}));

vi.mock("../../../home/cadastro/_components/cadastro-form", () => ({
  CadastroForm: ({ layout }: { layout?: string }) => (
    <div data-testid="cadastro-form-mock">layout:{layout}</div>
  ),
}));

describe("CadastroModalPage", () => {
  it("renderiza formulario de cadastro no slot modal com layout='modal'", () => {
    render(<CadastroModalPage />);

    expect(screen.getByTestId("modal-shell-mock")).toBeInTheDocument();
    expect(screen.getByTestId("cadastro-form-mock")).toHaveTextContent("layout:modal");
  });
});
