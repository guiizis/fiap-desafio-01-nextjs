import { beforeEach, describe, expect, it } from "vitest";
import { loginMockUser, registerMockUser, resetMockUsersStore } from "./mock-auth";

describe("mock-auth", () => {
  beforeEach(() => {
    resetMockUsersStore();
  });

  it("cadastra usuario com email normalizado", () => {
    const result = registerMockUser({
      name: "Maria da Silva",
      email: "  MARIA@MAIL.COM ",
      password: "123456",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.user.name).toBe("Maria da Silva");
      expect(result.user.email).toBe("maria@mail.com");
      expect(result.user.id).toBeTruthy();
      expect(result.user.createdAt).toBeTruthy();
    }
  });

  it("bloqueia cadastro com email duplicado", () => {
    registerMockUser({
      name: "Maria da Silva",
      email: "maria@mail.com",
      password: "123456",
    });

    const duplicated = registerMockUser({
      name: "Maria da Silva",
      email: "MARIA@mail.com",
      password: "123456",
    });

    expect(duplicated).toEqual({
      ok: false,
      error: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("faz login com credenciais validas", () => {
    const register = registerMockUser({
      name: "Joao Souza",
      email: "joao@mail.com",
      password: "senha-segura",
    });

    expect(register.ok).toBe(true);

    const login = loginMockUser({
      email: "JOAO@mail.com",
      password: "senha-segura",
    });

    expect(login.ok).toBe(true);

    if (login.ok) {
      expect(login.user.email).toBe("joao@mail.com");
      expect(login.token).toContain("mock-token-");
    }
  });

  it("retorna erro em login invalido", () => {
    const login = loginMockUser({
      email: "naoexiste@mail.com",
      password: "senha-incorreta",
    });

    expect(login).toEqual({
      ok: false,
      error: "INVALID_CREDENTIALS",
    });
  });
});
