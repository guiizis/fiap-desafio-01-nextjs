import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import RegisterModalPage from "./page";

vi.mock("../../_components/modal-shell", () => ({
  ModalShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-shell-mock">{children}</div>
  ),
}));

vi.mock("../../../home/register/_components/register-form", () => ({
  RegisterForm: ({ layout }: { layout?: string }) => (
    <div data-testid="register-form-mock">layout:{layout}</div>
  ),
}));

describe("RegisterModalPage", () => {
  it("renderiza formulario de cadastro no slot modal com layout='modal'", () => {
    render(<RegisterModalPage />);

    expect(screen.getByTestId("modal-shell-mock")).toBeInTheDocument();
    expect(screen.getByTestId("register-form-mock")).toHaveTextContent("layout:modal");
  });
});
