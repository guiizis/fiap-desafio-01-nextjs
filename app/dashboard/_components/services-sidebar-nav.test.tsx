import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardSidebarNav } from './dashboard-sidebar-nav';

const items = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'meus-cartoes', label: 'Meus cartoes' },
  { key: 'transferencias', label: 'Transferencias', disabled: true },
  { key: 'investimentos', label: 'Investimentos', disabled: true },
  { key: 'outros-servicos', label: 'Outros serviços', disabled: true },
] as const;

describe('DashboardSidebarNav', () => {
  it('destaca item ativo e respeita itens desabilitados', () => {
    const onChange = vi.fn();
    render(<DashboardSidebarNav items={items} activeItem="inicio" onChange={onChange} />);

    const activeButton = screen.getByRole('button', { name: 'Inicio' });
    const enabledButton = screen.getByRole('button', { name: 'Meus cartoes' });
    const disabledButton = screen.getByRole('button', { name: 'Transferencias' });

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
});
