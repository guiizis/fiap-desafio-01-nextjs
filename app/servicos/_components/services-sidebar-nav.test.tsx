import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ServicesSidebarNav } from "./services-sidebar-nav";

const items = [
  { key: "inicio", label: "Inicio" },
  { key: "meus-cartoes", label: "Meus cartoes" },
  { key: "transferencias", label: "Transferencias", disabled: true },
  { key: "investimentos", label: "Investimentos", disabled: true },
  { key: "outros-servicos", label: "Outros servicos", disabled: true },
] as const;

function getOpenButtons() {
  return screen.queryAllByRole("button", { name: "Fechar menu de servicos" });
}

function getMobileMenuPanel() {
  const closeButtons = getOpenButtons();
  const panelCloseButton = closeButtons[1];
  expect(panelCloseButton).toBeDefined();
  const panel = panelCloseButton.closest("div");
  expect(panel).not.toBeNull();
  return { panel: panel as HTMLDivElement, panelCloseButton };
}

describe("ServicesSidebarNav", () => {
  it("destaca item ativo e respeita itens desabilitados", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    const activeButton = screen.getByRole("button", { name: "Inicio" });
    const enabledButton = screen.getByRole("button", { name: "Meus cartoes" });
    const disabledButton = screen.getByRole("button", { name: "Transferencias" });

    expect(activeButton.className).toContain("text-secondary");
    expect(enabledButton.className).toContain("text-heading");
    expect(disabledButton).toBeDisabled();

    fireEvent.click(activeButton);
    fireEvent.click(enabledButton);
    fireEvent.click(disabledButton);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith("inicio");
    expect(onChange).toHaveBeenCalledWith("meus-cartoes");
  });

  it("abre e fecha o menu mobile pelo botao de toggle", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    expect(getOpenButtons()).toHaveLength(0);

    const toggleButton = screen.getByRole("button", { name: "Abrir menu de servicos" });
    fireEvent.click(toggleButton);

    expect(getOpenButtons()).toHaveLength(2);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(toggleButton).toHaveAttribute("aria-label", "Fechar menu de servicos");

    fireEvent.click(toggleButton);
    expect(getOpenButtons()).toHaveLength(0);
  });

  it("fecha o menu mobile ao selecionar item habilitado", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de servicos" }));

    const { panel } = getMobileMenuPanel();
    fireEvent.click(within(panel).getByRole("button", { name: "Meus cartoes" }));

    expect(onChange).toHaveBeenCalledWith("meus-cartoes");
    expect(getOpenButtons()).toHaveLength(0);
  });

  it("mantem menu mobile aberto quando clica em item desabilitado", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de servicos" }));

    const { panel } = getMobileMenuPanel();
    const disabledButton = within(panel).getByRole("button", { name: "Transferencias" });
    expect(disabledButton).toBeDisabled();

    fireEvent.click(disabledButton);

    expect(onChange).not.toHaveBeenCalledWith("transferencias");
    expect(getOpenButtons()).toHaveLength(2);
  });

  it("fecha o menu mobile pelo botao interno do painel", () => {
    const onChange = vi.fn();
    render(<ServicesSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de servicos" }));

    const { panelCloseButton } = getMobileMenuPanel();
    fireEvent.click(panelCloseButton);

    expect(getOpenButtons()).toHaveLength(0);
  });
});
