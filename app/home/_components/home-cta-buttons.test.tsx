import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeCtaButtons } from "./home-cta-buttons";

const { useAuthSessionMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
}));

vi.mock("@/app/dashboard/_hooks/use-auth-session", () => ({
  useAuthSession: useAuthSessionMock,
}));

describe("HomeCtaButtons", () => {
  beforeEach(() => {
    useAuthSessionMock.mockReturnValue({
      status: "unauthenticated",
    });
  });

  it("renderiza CTAs de header com links e estilos esperados", () => {
    render(<HomeCtaButtons context="header" />);

    const primary = screen.getByRole("link", { name: /abrir minha conta/i });
    const secondary = screen.getByRole("link", { name: /tenho conta/i });

    expect(primary.getAttribute("href")).toBe("/home/register");
    expect(secondary.getAttribute("href")).toBe("/home/login");
    expect(primary.className).toContain("border-secondary");
    expect(primary.className).toContain("bg-secondary");
    expect(secondary.className).toContain("border-secondary");
    expect(secondary.className).toContain("bg-transparent");
  });

  it("renderiza CTAs de hero-mobile com copy e classes especificas", () => {
    render(<HomeCtaButtons context="hero-mobile" />);

    const primary = screen.getByRole("link", { name: /abrir conta/i });
    const secondary = screen.getByRole("link", { name: /tenho conta/i });

    expect(primary.getAttribute("href")).toBe("/home/register");
    expect(secondary.getAttribute("href")).toBe("/home/login");
    expect(primary.className).toContain("h-12");
    expect(primary.className).toContain("bg-black");
    expect(secondary.className).toContain("border-black");
    expect(secondary.className).toContain("text-black");
  });

  it("troca CTAs de autenticacao por acesso ao dashboard quando existe sessao ativa", () => {
    useAuthSessionMock.mockReturnValue({
      status: "authenticated",
    });

    render(<HomeCtaButtons context="header" />);

    expect(screen.queryByRole("link", { name: /abrir minha conta/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /tenho conta/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /acessar minha conta/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("nao renderiza CTAs enquanto a sessao esta carregando", () => {
    useAuthSessionMock.mockReturnValue({
      status: "loading",
    });

    const { container } = render(<HomeCtaButtons context="header" />);

    expect(container).toBeEmptyDOMElement();
  });
});
