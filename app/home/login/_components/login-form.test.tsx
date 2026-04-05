import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const fillValidForm = () => {
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "user@mail.com" } });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "123456" } });
  };

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

  it("envia login e mostra feedback de sucesso da API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: "Login realizado com sucesso." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm layout="modal" />);
    fillValidForm();

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/mock/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "user@mail.com",
          password: "123456",
        }),
      });
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Login realizado com sucesso.");
  });

  it("mostra feedback de erro quando API retorna falha", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Email ou senha invalidos." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email ou senha invalidos.");
  });

  it("usa fallback de sucesso quando resposta nao tem JSON valido", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("sem json")),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Login realizado com sucesso.");
  });

  it("mostra erro de conexao quando fetch falha", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro de conexao. Tente novamente em instantes."
    );
  });
});
