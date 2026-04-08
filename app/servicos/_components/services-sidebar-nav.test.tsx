import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ServicesSidebarNav } from "./services-sidebar-nav";

const items = [
  { key: "inicio", label: "Inicio" },
  { key: "transferencias", label: "Transferencias" },
  { key: "investimentos", label: "Investimentos" },
  { key: "outros-servicos", label: "Outros servicos" },
  { key: "meus-cartoes", label: "Meus cartoes" },
] as const;

describe("ServicesSidebarNav", () => {
  it("destaca item ativo e dispara onChange ao clicar em outro item", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    const activeButton = screen.getByRole("button", { name: "Inicio" });
    const otherButton = screen.getByRole("button", { name: "Meus cartoes" });

    expect(activeButton.className).toContain("text-secondary");
    expect(otherButton.className).toContain("text-heading");

    fireEvent.click(otherButton);
    expect(onChange).toHaveBeenCalledWith("meus-cartoes");
  });
});
