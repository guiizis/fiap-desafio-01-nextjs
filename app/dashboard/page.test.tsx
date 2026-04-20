import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_SESSION_STORAGE_KEY } from "../lib/auth-session";
import ServicosPage from "./page";

const { replaceMock, routerMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  routerMock: {
    replace: vi.fn(),
  },
}));

routerMock.replace = replaceMock;

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("./_components/servicos-header", () => ({
  ServicosHeader: ({ userName }: { userName: string }) => <header>Header {userName}</header>,
}));

vi.mock("./_components/services-dashboard", () => ({
  ServicesDashboard: ({
    userFirstName,
    balanceInCents,
    statementEntries,
  }: {
    userFirstName: string;
    balanceInCents: number;
    statementEntries: { id: string }[];
  }) => (
    <section>
      Dashboard {userFirstName} {balanceInCents} {statementEntries.length}
    </section>
  ),
}));

describe("ServicosPage", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    sessionStorage.clear();
  });

  it("redireciona para login quando sessao nao existe", async () => {
    render(<ServicosPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/home/login");
    });
  });

  it("renderiza area de servicos com dados da sessao", async () => {
    sessionStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({
        token: "mock-token-user-1",
        user: {
          id: "user-1",
          name: "Joana da Silva Oliveira",
          email: "joana@mail.com",
          createdAt: "2026-01-01T00:00:00.000Z",
          accountBalanceInCents: 250000,
          statementEntries: [
            {
              id: "entry-1",
              month: "Novembro",
              type: "Deposito",
              amountInCents: 5000,
              date: "21/11/2022",
            },
          ],
        },
      })
    );

    render(<ServicosPage />);

    expect(await screen.findByText("Header Joana da Silva Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Joana 250000 1")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redireciona para login quando sessao salva estiver invalida", async () => {
    sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, "json-invalido");

    render(<ServicosPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/home/login");
    });
  });

  it("mantem nome vazio quando nao existe primeiro nome valido", async () => {
    sessionStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({
        token: "mock-token-user-1",
        user: {
          id: "user-1",
          name: "",
          email: "joana@mail.com",
          createdAt: "2026-01-01T00:00:00.000Z",
          accountBalanceInCents: 250000,
          statementEntries: [],
        },
      })
    );

    render(<ServicosPage />);

    expect(await screen.findByText(/^Dashboard\s+250000\s+0$/)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
