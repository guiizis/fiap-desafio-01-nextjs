import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicosHeader } from "./servicos-header";

describe("ServicosHeader", () => {
  it("renderiza nome do usuario e botao de perfil", () => {
    render(<ServicosHeader userName="Joana Fonseca Gomes" />);

    expect(screen.getByText("Joana Fonseca Gomes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Perfil do usuario" })).toBeInTheDocument();
  });
});
