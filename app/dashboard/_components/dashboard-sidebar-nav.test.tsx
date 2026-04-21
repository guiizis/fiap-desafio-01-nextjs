import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardSidebarNav } from './dashboard-sidebar-nav';

const items = [
  { key: 'inicio', label: 'In\u00edcio' },
  { key: 'meus-cartoes', label: 'Meus cart\u00f5es' },
  { key: 'transferencias', label: 'Transfer\u00eancias', disabled: true },
  { key: 'investimentos', label: 'Investimentos', disabled: true },
  { key: 'outros-servicos', label: 'Outros servi\u00e7os', disabled: true },
] as const;

function triggerButtonClickHandler(element: HTMLElement) {
  const reactPropsKey = Object.keys(element).find((key) => key.startsWith('__reactProps$'));
  if (!reactPropsKey) {
    throw new Error('Props internas do React nao encontradas');
  }

  const reactProps = (element as Record<string, unknown>)[reactPropsKey] as {
    onClick?: () => void;
  };
  reactProps.onClick?.();
}

function getOpenButtons() {
  return screen.queryAllByRole('button', { name: /fechar menu de servi[c\u00e7]os/i });
}

function getMobileMenuPanel() {
  const closeButtons = getOpenButtons();
  const panelCloseButton = closeButtons[1];
  expect(panelCloseButton).toBeDefined();
  const panel = panelCloseButton.closest('div');
  expect(panel).not.toBeNull();
  return { panel: panel as HTMLDivElement, panelCloseButton };
}

describe('DashboardSidebarNav', () => {
  it('destaca item ativo e respeita itens desabilitados', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    const activeButton = screen.getByRole('button', { name: /in[i\u00ed]cio/i });
    const enabledButton = screen.getByRole('button', { name: /meus cart[o\u00f5]es/i });
    const disabledButton = screen.getByRole('button', { name: /transfer[e\u00ea]ncias/i });

    expect(activeButton.className).toContain('text-secondary');
    expect(enabledButton.className).toContain('text-heading');
    expect(disabledButton).toBeDisabled();

    fireEvent.click(activeButton);
    fireEvent.click(enabledButton);
    fireEvent.click(disabledButton);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith('inicio');
    expect(onChange).toHaveBeenCalledWith('meus-cartoes');
  });

  it('abre e fecha o menu mobile pelo botao de toggle', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    expect(getOpenButtons()).toHaveLength(0);

    const toggleButton = screen.getByRole('button', { name: /abrir menu de servi[c\u00e7]os/i });
    fireEvent.click(toggleButton);

    expect(getOpenButtons()).toHaveLength(2);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', expect.stringMatching(/fechar menu/i));

    fireEvent.click(toggleButton);
    expect(getOpenButtons()).toHaveLength(0);
  });

  it('fecha o menu mobile ao selecionar item habilitado', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /abrir menu de servi[c\u00e7]os/i }));

    const { panel } = getMobileMenuPanel();
    fireEvent.click(within(panel).getByRole('button', { name: /meus cart[o\u00f5]es/i }));

    expect(onChange).toHaveBeenCalledWith('meus-cartoes');
    expect(getOpenButtons()).toHaveLength(0);
  });

  it('mantem menu mobile aberto quando clica em item desabilitado', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /abrir menu de servi[c\u00e7]os/i }));

    const { panel } = getMobileMenuPanel();
    const disabledButton = within(panel).getByRole('button', { name: /transfer[e\u00ea]ncias/i });
    expect(disabledButton).toBeDisabled();

    fireEvent.click(disabledButton);

    expect(onChange).not.toHaveBeenCalledWith('transferencias');
    expect(getOpenButtons()).toHaveLength(2);
  });

  it('ignora item desabilitado mesmo quando handler onClick e disparado manualmente', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    const disabledDesktopButton = screen.getByRole('button', { name: /transfer[e\u00ea]ncias/i });
    triggerButtonClickHandler(disabledDesktopButton);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('fecha o menu mobile pelo botao interno do painel', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /abrir menu de servi[c\u00e7]os/i }));

    const { panelCloseButton } = getMobileMenuPanel();
    fireEvent.click(panelCloseButton);

    expect(getOpenButtons()).toHaveLength(0);
  });
});
