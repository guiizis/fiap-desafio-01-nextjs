import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeader } from "./home-header";

describe("HomeHeader", () => {
  it("renderiza logo, navegacao e botoes principais", () => {
    render(<HomeHeader />);

    expect(screen.getByAltText("McIntosh Bank")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Servi/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir minha conta/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tenho conta/i })).toBeInTheDocument();
  });
});
