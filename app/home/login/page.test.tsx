import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

vi.mock("./_components/login-form", () => ({
  LoginForm: ({ layout }: { layout?: string }) => (
    <div data-testid="login-form-mock">layout:{layout}</div>
  ),
}));

describe("LoginPage", () => {
  it("renderiza wrapper da pagina e passa layout='page'", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-form-mock")).toHaveTextContent("layout:page");
    expect(screen.getByRole("main").className).toContain("max-w-3xl");
  });
});
