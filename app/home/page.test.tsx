import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renderiza a estrutura base da pagina home", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Experimente mais liberdade no controle da sua vida financeira/i,
        level: 1,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Vantagens do nosso banco:", level: 2 })
    ).toBeInTheDocument();
  });
});
