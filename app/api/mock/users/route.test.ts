import { beforeEach, describe, expect, it } from "vitest";
import { resetMockUsersStore } from "../../../lib/mock-auth";
import { GET, POST } from "./route";

describe("POST /api/mock/users", () => {
  beforeEach(() => {
    resetMockUsersStore();
  });

  it("retorna 400 quando body tem JSON invalido", async () => {
    const request = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: "{ nome-invalido",
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toContain("JSON invalido");
  });

  it("retorna 400 quando faltam campos obrigatorios", async () => {
    const request = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: JSON.stringify({ name: "Ana" }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toContain("Campos obrigatorios");
  });

  it("cria usuario com status 201", async () => {
    const request = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ana Souza",
        email: "ana@mail.com",
        password: "123456",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.message).toBe("Usuario criado com sucesso.");
    expect(payload.user.email).toBe("ana@mail.com");
    expect(payload.user.password).toBeUndefined();
  });

  it("retorna 409 para email duplicado", async () => {
    const firstRequest = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ana Souza",
        email: "ana@mail.com",
        password: "123456",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const duplicatedRequest = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ana Souza",
        email: "ANA@mail.com",
        password: "123456",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    await POST(firstRequest);
    const response = await POST(duplicatedRequest);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.message).toContain("Ja existe usuario");
  });

  it("retorna lista vazia no GET quando nao ha usuarios", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.users).toEqual([]);
  });

  it("lista usuarios cadastrados no GET sem expor senha", async () => {
    const createRequest = new Request("http://localhost:3000/api/mock/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ana Souza",
        email: "ana@mail.com",
        password: "123456",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    await POST(createRequest);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.users).toHaveLength(1);
    expect(payload.users[0].email).toBe("ana@mail.com");
    expect(payload.users[0].password).toBeUndefined();
  });
});
