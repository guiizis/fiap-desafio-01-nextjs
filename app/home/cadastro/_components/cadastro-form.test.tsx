import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CadastroForm } from "./cadastro-form";

describe("CadastroForm", () => {
  it("renderiza campos e botao no layout padrao", () => {
    render(<CadastroForm />);

    expect(
      screen.getByRole("heading", {
        name: /preencha os campos abaixo para criar sua conta corrente/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
  });

  it("aplica classe de senha especifica no layout modal", () => {
    render(<CadastroForm layout="modal" />);

    const senha = screen.getByLabelText("Senha");
    expect(senha.className).toContain("max-w-[165px]");
    expect(senha.className).toContain("mobile:max-w-none");
  });

  it("mostra erro para email invalido no blur", () => {
    render(<CadastroForm layout="modal" />);

    const email = screen.getByLabelText("Email");
    fireEvent.blur(email, { target: { value: "email-invalido" } });

    expect(screen.getByText("Dado incorreto. Revise e digite novamente.")).toBeInTheDocument();
  });

  it("remove erro quando o campo volta a ser valido no change", () => {
    render(<CadastroForm layout="modal" />);

    const email = screen.getByLabelText("Email");
    fireEvent.blur(email, { target: { value: "email-invalido" } });

    expect(screen.getByText("Dado incorreto. Revise e digite novamente.")).toBeInTheDocument();

    fireEvent.change(email, { target: { value: "valido@mail.com" } });

    expect(screen.queryByText("Dado incorreto. Revise e digite novamente.")).not.toBeInTheDocument();
  });

  it("nao mostra erro no change se o campo ainda nao estava em erro", () => {
    render(<CadastroForm layout="modal" />);

    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "email-invalido" } });

    expect(screen.queryByText("Dado incorreto. Revise e digite novamente.")).not.toBeInTheDocument();
  });

  it("mantem botao desabilitado ate o form ficar valido", () => {
    render(<CadastroForm layout="modal" />);

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    expect(submitButton).toBeDisabled();

    fireEvent.input(screen.getByLabelText("Nome"), { target: { value: "Maria Silva" } });
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "maria@mail.com" } });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "123456" } });

    expect(submitButton).toBeEnabled();

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "email-invalido" } });
    expect(submitButton).toBeDisabled();
  });
});
