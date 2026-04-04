import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("renderiza campos principais e botao de acesso", () => {
    render(<LoginForm />);

    expect(screen.getByRole("heading", { name: "Login", level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /esqueci a senha/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /acessar/i })).toBeInTheDocument();
  });

  it("mantem o campo de senha com largura total no modal", () => {
    render(<LoginForm layout="modal" />);

    const senha = screen.getByLabelText("Senha");
    expect(senha.className).toContain("w-full");
    expect(senha.className).not.toContain("max-w-[165px]");
  });
});
