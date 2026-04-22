import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardContentPanel } from './dashboard-content-panel';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe('DashboardContentPanel', () => {
  it('renderiza painel de nova transacao quando a aba ativa e inicio', () => {
    render(<DashboardContentPanel activeTab="inicio" />);

    expect(screen.getByText(/nova transa[c\u00e7][a\u00e3]o/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /concluir transa[c\u00e7][a\u00e3]o/i })).toBeInTheDocument();
  });

  it('renderiza painel de transacoes com dados recebidos', () => {
    const onDeleteEntry = vi.fn();

    render(
      <DashboardContentPanel
        activeTab="transacoes"
        transactionEntries={[
          { id: 'entry-1', month: 'Abril', type: 'Deposito', amountInCents: 2500, date: '21/04/2026' },
        ]}
        onDeleteEntry={onDeleteEntry}
      />
    );

    expect(screen.getByRole('heading', { name: /transa[c\u00e7][o\u00f5]es/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/painel de transa[c\u00e7][o\u00f5]es/i)).toBeInTheDocument();

    const selectedEntry = screen.getByText('21/04/2026').closest('li');
    if (!selectedEntry) {
      throw new Error('Lancamento nao encontrado');
    }

    fireEvent.click(selectedEntry);
    fireEvent.click(screen.getByRole('button', { name: /excluir extrato/i }));
    expect(onDeleteEntry).toHaveBeenCalledWith('entry-1');
  });

  it('renderiza conteudo correspondente da aba ativa', () => {
    render(<DashboardContentPanel activeTab="meus-cartoes" />);

    expect(
      screen.getByText(/gerencie seus cart[o\u00f5]es f[i\u00ed]sico e digital com rapidez\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /abrir aviso do servi[c\u00e7]o empr/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /abrir aviso do servi[c\u00e7]o meus cart/i })
    ).toBeInTheDocument();
  });

  it('abre modal de ainda em construcao e volta para /dashboard', () => {
    replaceMock.mockClear();

    render(<DashboardContentPanel activeTab="meus-cartoes" />);

    const [openWarningButton] = screen.getAllByRole('button', {
      name: /abrir aviso do servi[c\u00e7]o/i,
    });

    fireEvent.click(openWarningButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/ainda em constru/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /voltar para servi[c\u00e7]os/i }));

    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
