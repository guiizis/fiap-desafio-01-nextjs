import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CadastroForm } from "./cadastro-form";

describe("CadastroForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const fillValidForm = () => {
    fireEvent.input(screen.getByLabelText("Nome"), { target: { value: "Maria Silva" } });
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "maria@mail.com" } });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "123456" } });
  };

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

  it("envia cadastro e mostra feedback de sucesso da API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: "Usuario criado com sucesso." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CadastroForm layout="modal" />);
    fillValidForm();

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/mock/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Maria Silva",
          email: "maria@mail.com",
          password: "123456",
        }),
      });
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Usuario criado com sucesso.");
  });

  it("mostra feedback de erro quando API retorna falha", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Ja existe usuario cadastrado com este email." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CadastroForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ja existe usuario cadastrado com este email."
    );
  });

  it("usa fallback de sucesso quando resposta nao tem JSON valido", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("sem json")),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CadastroForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Usuario criado com sucesso.");
  });

  it("mostra erro de conexao quando fetch falha", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", fetchMock);

    render(<CadastroForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro de conexao. Tente novamente em instantes."
    );
  });
});
