import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeader } from "./home-header";

describe("HomeHeader", () => {
  it("renderiza estruturas de desktop, tablet e mobile do header", () => {
    render(<HomeHeader />);

    expect(screen.getByAltText("McIntosh Bank")).toBeInTheDocument();
    expect(screen.getByAltText("McIntosh Bank símbolo tablet")).toBeInTheDocument();
    expect(screen.getByAltText("McIntosh Bank mobile")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir menu de navegação/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Servi/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir minha conta/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tenho conta/i })).toBeInTheDocument();
  });
});
