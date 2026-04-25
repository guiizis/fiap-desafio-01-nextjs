import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./statement-panel', () => ({
  StatementPanel: ({
    onDeleteEntry,
    onEditEntry,
  }: {
    onDeleteEntry?: (entryId: string) => void;
    onEditEntry?: (payload: {
      entryId: string;
      type: 'deposito' | 'transferencia';
      amountInCents: number;
      transactionDate: string;
    }) => { ok: boolean; message?: string } | void;
  }) => (
    <div>
      <button type="button" onClick={() => onDeleteEntry?.('entry-inexistente')}>
        Excluir inexistente
      </button>
      <button
        type="button"
        onClick={() =>
          onEditEntry?.({
            entryId: 'entry-inexistente',
            type: 'deposito',
            amountInCents: 12345,
            transactionDate: '2026-04-21',
          })
        }
      >
        Editar inexistente
      </button>
      <button
        type="button"
        onClick={() =>
          onEditEntry?.({
            entryId: '1',
            type: 'deposito',
            amountInCents: 12345,
            transactionDate: '1900-01-01',
          })
        }
      >
        Editar com data invalida
      </button>
      <button
        type="button"
        onClick={() =>
          onEditEntry?.({
            entryId: '1',
            type: 'transferencia',
            amountInCents: 999_999_99,
            transactionDate: '2026-04-21',
          })
        }
      >
        Editar com saldo insuficiente
      </button>
    </div>
  ),
}));

import { Dashboard } from './dashboard';

const statementEntries = [
  { id: '1', month: 'Novembro', type: 'Deposito', amountInCents: 15000, date: '18/11/2022' },
] as const;

describe('Dashboard guards', () => {
  it('mantem saldo quando handlers recebem payloads invalidos de editar e excluir', () => {
    render(
      <Dashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir inexistente' }));
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar inexistente' }));
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar com data invalida' }));
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar com saldo insuficiente' }));
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();
  });
});
