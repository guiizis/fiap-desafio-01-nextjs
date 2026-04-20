import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardHeader } from "./dashboard-header";

describe("DashboardHeader", () => {
  it("renderiza nome do usuario e botao de perfil", () => {
    render(<DashboardHeader userName="Joana Fonseca Gomes" />);

    expect(screen.getByText("Joana Fonseca Gomes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Perfil do usuario" })).toBeInTheDocument();
  });
});
