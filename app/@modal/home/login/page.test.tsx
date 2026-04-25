import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import LoginModalPage from "./page";

vi.mock("../../_components/modal-shell", () => ({
  ModalShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-shell-mock">{children}</div>
  ),
}));

vi.mock("../../../home/login/_components/login-form", () => ({
  LoginForm: ({ layout }: { layout?: string }) => (
    <div data-testid="login-form-mock">layout:{layout}</div>
  ),
}));

describe("LoginModalPage", () => {
  it("renderiza formulario de login no slot modal com layout='modal'", () => {
    render(<LoginModalPage />);

    expect(screen.getByTestId("modal-shell-mock")).toBeInTheDocument();
    expect(screen.getByTestId("login-form-mock")).toHaveTextContent("layout:modal");
  });
});
