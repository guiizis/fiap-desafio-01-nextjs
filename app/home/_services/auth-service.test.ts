import { afterEach, describe, expect, it, vi } from "vitest";
import { loginMockAccount, registerMockAccount } from "./auth-service";

describe("auth-service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("envia cadastro para /api/mock/users e usa mensagem da API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: "Usuario criado com sucesso." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await registerMockAccount({
      name: "Maria",
      email: "maria@mail.com",
      password: "123456",
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/mock/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Maria",
        email: "maria@mail.com",
        password: "123456",
      }),
    });
    expect(result).toEqual({
      ok: true,
      message: "Usuario criado com sucesso.",
    });
  });

  it("usa fallback de sucesso quando response.json falha", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("sem json")),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await registerMockAccount({
      name: "Maria",
      email: "maria@mail.com",
      password: "123456",
    });

    expect(result).toEqual({
      ok: true,
      message: "Usuario criado com sucesso.",
    });
  });

  it("usa fallback de erro quando API nao manda mensagem", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await registerMockAccount({
      name: "Maria",
      email: "maria@mail.com",
      password: "123456",
    });

    expect(result).toEqual({
      ok: false,
      message: "Nao foi possivel criar a conta. Tente novamente.",
    });
  });

  it("ignora mensagem vazia da API no login e usa fallback", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "   " }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await loginMockAccount({
      email: "maria@mail.com",
      password: "123456",
    });

    expect(result).toEqual({
      ok: false,
      message: "Nao foi possivel autenticar. Revise seus dados.",
    });
  });

  it("retorna erro de conexao quando fetch falha", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await loginMockAccount({
      email: "maria@mail.com",
      password: "123456",
    });

    expect(result).toEqual({
      ok: false,
      message: "Erro de conexao. Tente novamente em instantes.",
    });
  });
});
