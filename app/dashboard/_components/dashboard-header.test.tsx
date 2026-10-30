import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardHeader } from './dashboard-header';

describe('DashboardHeader', () => {
  it('renderiza nome do usuario e botao de perfil', () => {
    render(<DashboardHeader userName="Joana Fonseca Gomes" />);

    expect(screen.getByText('Joana Fonseca Gomes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perfil do usuario' })).toBeInTheDocument();
  });

  it('dispara logout pelo botao de sair', () => {
    const onLogout = vi.fn();
    render(<DashboardHeader userName="Joana" onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
