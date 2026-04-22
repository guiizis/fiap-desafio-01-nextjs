import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const submitResultSpy = vi.fn();

vi.mock('./dashboard-content-panel', () => ({
  DashboardContentPanel: ({
    onSubmitTransaction,
  }: {
    onSubmitTransaction?: (payload: {
      type: 'deposito' | 'transferencia';
      amountInCents: number;
      transactionDate: string;
    }) => { ok: boolean; message?: string } | void;
  }) => (
    <button
      type="button"
      onClick={() => {
        const result = onSubmitTransaction?.({
          type: 'deposito',
          amountInCents: 100,
          transactionDate: '275760-04-19',
        });
        submitResultSpy(result);
      }}
    >
      Disparar transacao invalida
    </button>
  ),
}));

import { Dashboard } from './dashboard';

const statementEntries = [
  { id: '1', month: 'Novembro', type: 'Deposito', amountInCents: 15000, date: '18/11/2022' },
] as const;

describe('Dashboard invalid date guard', () => {
  it('retorna erro quando callback recebe data fora do range permitido', () => {
    submitResultSpy.mockReset();

    render(
      <Dashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Disparar transacao invalida' }));

    const result = submitResultSpy.mock.calls[0]?.[0] as { ok: boolean; message: string };
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Data inv[a\u00e1]lida\./i);
    expect(result.message).toContain('01/01/');
    expect(result.message).toContain('31/12/');
  });
});
