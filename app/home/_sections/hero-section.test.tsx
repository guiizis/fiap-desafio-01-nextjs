import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("renderiza titulo principal e ilustracao", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        name: /Experimente mais liberdade no controle da sua vida financeira/i,
        level: 1,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Ilustracao de crescimento financeiro" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir conta" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tenho conta/i })).toBeInTheDocument();
  });
});
