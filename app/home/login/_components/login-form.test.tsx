import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

const { loginMockAccountMock } = vi.hoisted(() => ({
  loginMockAccountMock: vi.fn(),
}));

vi.mock("../../_services/auth-service", () => ({
  loginMockAccount: loginMockAccountMock,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    loginMockAccountMock.mockResolvedValue({
      ok: true,
      message: "Login realizado com sucesso.",
    });

    render(<LoginForm layout="modal" />);
    fillValidForm();

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginMockAccountMock).toHaveBeenCalledWith({
        email: "user@mail.com",
        password: "123456",
      });
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Login realizado com sucesso.");
  });

  it("usa fallback vazio quando FormData retorna null", async () => {
    loginMockAccountMock.mockResolvedValue({
      ok: false,
      message: "Dados obrigatorios ausentes.",
    });

    render(<LoginForm layout="modal" />);
    const formDataGetSpy = vi.spyOn(FormData.prototype, "get").mockReturnValue(null);

    const form = screen
      .getByRole("button", { name: /acessar/i })
      .closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(loginMockAccountMock).toHaveBeenCalledWith({
        email: "",
        password: "",
      });
    });

    formDataGetSpy.mockRestore();
  });

  it("mostra feedback de erro quando API retorna falha", async () => {
    loginMockAccountMock.mockResolvedValue({
      ok: false,
      message: "Email ou senha invalidos.",
    });

    render(<LoginForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email ou senha invalidos.");
  });

  it("fecha alerta manualmente no botao x", async () => {
    loginMockAccountMock.mockResolvedValue({
      ok: false,
      message: "Falha ao autenticar",
    });

    render(<LoginForm layout="modal" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao autenticar");

    fireEvent.click(screen.getByRole("button", { name: /fechar alerta/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
