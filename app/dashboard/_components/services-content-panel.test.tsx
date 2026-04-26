import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardContentPanel } from './services-content-panel';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe('ServicesContentPanel (legacy)', () => {
  it('renderiza painel de nova transacao na aba inicio', () => {
    render(<DashboardContentPanel activeTab="home" />);

    expect(screen.getByText(/nova transa[c\u00e7][a\u00e3]o/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /concluir transa[c\u00e7][a\u00e3]o/i })
    ).toBeInTheDocument();
  });

  it.each([
    ['home', /nova transa[c\u00e7][a\u00e3]o/i],
    ['transactions', /transa[c\u00e7][o\u00f5]es/i],
    ['investments', /investimentos/i],
    ['other-services', /confira os servi[c\u00e7]os dispon[i\u00ed]veis/i],
  ] as const)('renderiza conteudo da aba %s', (activeTab, expectedTitle) => {
    render(<DashboardContentPanel activeTab={activeTab} />);
    expect(screen.getByRole('heading', { name: expectedTitle })).toBeInTheDocument();
  });

  it('renderiza meus cartoes e abre modal de aviso', () => {
    replaceMock.mockClear();
    render(<DashboardContentPanel activeTab="my-cards" />);

    expect(
      screen.getByText(/gerencie seus cart[o\u00f5]es f[i\u00ed]sico e digital com rapidez\./i)
    ).toBeInTheDocument();

    const [openWarningButton] = screen.getAllByRole('button', {
      name: /abrir aviso do servico/i,
    });
    fireEvent.click(openWarningButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /voltar para o painel/i }));
  });
});
