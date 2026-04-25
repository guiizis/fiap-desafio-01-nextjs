import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeFooter } from "./home-footer";

describe("HomeFooter", () => {
  it("renderiza secoes, contatos, logo e icones sociais", () => {
    render(<HomeFooter />);

    expect(screen.getByText("Servicos")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvido por Mcintosh Bank")).toBeInTheDocument();
    expect(screen.getByAltText("Mcintosh Bank")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Instagram da Mcintosh Bank" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "WhatsApp da Mcintosh Bank" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "YouTube da Mcintosh Bank" })
    ).toBeInTheDocument();
  });
});
