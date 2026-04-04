import { fireEvent, render, screen } from "@testing-library/react";
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

  it("aplica constraints de validacao nos campos", () => {
    render(<LoginForm layout="modal" />);

    const email = screen.getByLabelText("Email");
    const senha = screen.getByLabelText("Senha");

    expect(email).toHaveAttribute("required");
    expect(senha).toHaveAttribute("required");
    expect(senha).toHaveAttribute("minLength", "6");
  });

  it("habilita o botao apenas quando form estiver valido", () => {
    render(<LoginForm layout="modal" />);

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    expect(submitButton).toBeDisabled();

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "user@mail.com" } });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "123456" } });

    expect(submitButton).toBeEnabled();

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "email-invalido" } });
    expect(submitButton).toBeDisabled();
  });
});
