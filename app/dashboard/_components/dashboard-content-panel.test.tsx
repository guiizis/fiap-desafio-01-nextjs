import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardContentPanel } from './services-content-panel';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe('DashboardContentPanel', () => {
  it('renderiza conteudo correspondente da aba ativa', () => {
    render(<DashboardContentPanel activeTab="meus-cartoes" />);

    expect(
      screen.getByText('Gerencie seus cartoes fisico e digital com rapidez.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Abrir aviso do servico Empr/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Abrir aviso do servico Meus cart/i })
    ).toBeInTheDocument();
  });

  it('abre modal de ainda em construcao e volta para /dashboard', () => {
    replaceMock.mockClear();

    render(<DashboardContentPanel activeTab="meus-cartoes" />);

    const [openWarningButton] = screen.getAllByRole('button', {
      name: /Abrir aviso do servico/i,
    });

    fireEvent.click(openWarningButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Ainda em construção')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para serviços' }));

    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
