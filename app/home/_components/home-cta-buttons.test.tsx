import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeCtaButtons } from "./home-cta-buttons";

describe("HomeCtaButtons", () => {
  it("renderiza CTAs de header com links e estilos esperados", () => {
    render(<HomeCtaButtons context="header" />);

    const primary = screen.getByRole("link", { name: /abrir minha conta/i });
    const secondary = screen.getByRole("link", { name: /tenho conta/i });

    expect(primary.getAttribute("href")).toBe("/home/cadastro");
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

    expect(primary.getAttribute("href")).toBe("/home/cadastro");
    expect(secondary.getAttribute("href")).toBe("/home/login");
    expect(primary.className).toContain("h-12");
    expect(primary.className).toContain("bg-black");
    expect(secondary.className).toContain("border-black");
    expect(secondary.className).toContain("text-black");
  });
});
