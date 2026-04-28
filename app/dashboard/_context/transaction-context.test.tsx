import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TransactionProvider, useTransactionContext } from './transaction-context';
import type { StatementEntry } from '../_components/interfaces/statement-panel.interfaces';
import { StatementEntryType } from '../_components/interfaces/statement-panel.interfaces';

const createMockEntries = (): StatementEntry[] => [
  {
    id: 'entry-1',
    month: 'abr 2026',
    type: StatementEntryType.DEPOSIT,
    amountInCents: 100000,
    date: '28/04/2026',
  },
  {
    id: 'entry-2',
    month: 'abr 2026',
    type: StatementEntryType.TRANSFER,
    amountInCents: -50000,
    date: '27/04/2026',
  },
];

const renderTransactionProvider = (
  initialBalanceInCents: number = 50000,
  initialStatementEntries: readonly StatementEntry[] = createMockEntries()
) => {
  return renderHook(() => useTransactionContext(), {
    wrapper: ({ children }) => (
      <TransactionProvider
        initialBalanceInCents={initialBalanceInCents}
        initialStatementEntries={initialStatementEntries}
      >
        {children}
      </TransactionProvider>
    ),
  });
};

describe('TransactionContext', () => {
  it('fornece saldo inicial correto', () => {
    const { result } = renderTransactionProvider(100000);
    expect(result.current.balanceInCents).toBe(100000);
  });

  it('fornece entradas de extrato iniciais', () => {
    const { result } = renderTransactionProvider();
    expect(result.current.statementEntries).toHaveLength(2);
  });

  describe('submitTransaction', () => {
    it('adiciona novo depósito e atualiza saldo', () => {
      const { result } = renderTransactionProvider(50000);

      act(() => {
        const response = result.current.submitTransaction({
          type: 'deposit' as const,
          amountInCents: 30000,
          transactionDate: '2026-04-28',
        });

        expect(response.ok).toBe(true);
      });

      expect(result.current.balanceInCents).toBe(80000);
      expect(result.current.statementEntries).toHaveLength(3);
    });

    it('adiciona nova transferência e atualiza saldo', () => {
      const { result } = renderTransactionProvider(50000);

      act(() => {
        const response = result.current.submitTransaction({
          type: 'transfer' as const,
          amountInCents: 20000,
          transactionDate: '2026-04-28',
        });

        expect(response.ok).toBe(true);
      });

      expect(result.current.balanceInCents).toBe(30000);
      expect(result.current.statementEntries).toHaveLength(3);
    });

    it('rejeita transferência quando saldo insuficiente', () => {
      const { result } = renderTransactionProvider(10000);

      const response = result.current.submitTransaction({
        type: 'transfer' as const,
        amountInCents: 20000,
        transactionDate: '2026-04-28',
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('Saldo insuficiente para concluir a transferência.');
    });

    it('rejeita data inválida', () => {
      const { result } = renderTransactionProvider(50000);

      const response = result.current.submitTransaction({
        type: 'deposit' as const,
        amountInCents: 10000,
        transactionDate: '2025-01-01',
      });

      expect(response.ok).toBe(false);
      expect(response.message).toContain('Data inválida');
    });
  });

  describe('deleteEntry', () => {
    it('remove entrada e atualiza saldo', () => {
      const { result } = renderTransactionProvider(50000);

      act(() => {
        result.current.deleteEntry('entry-2');
      });

      expect(result.current.balanceInCents).toBe(100000);
      expect(result.current.statementEntries).toHaveLength(1);
    });

    it('não altera estado se entrada não existir', () => {
      const { result } = renderTransactionProvider(50000);

      act(() => {
        result.current.deleteEntry('non-existent-id');
      });

      expect(result.current.balanceInCents).toBe(50000);
      expect(result.current.statementEntries).toHaveLength(2);
    });
  });

  describe('editEntry', () => {
    it('edita entrada e atualiza saldo', () => {
      const { result } = renderTransactionProvider(50000);

      act(() => {
        const response = result.current.editEntry({
          entryId: 'entry-2',
          type: 'deposit' as const,
          amountInCents: 80000,
          transactionDate: '2026-04-28',
        });

        expect(response.ok).toBe(true);
      });

      expect(result.current.balanceInCents).toBe(130000);
    });

    it('rejeita edição quando entrada não encontrada', () => {
      const { result } = renderTransactionProvider(50000);

      const response = result.current.editEntry({
        entryId: 'non-existent-id',
        type: 'deposit' as const,
        amountInCents: 10000,
        transactionDate: '2026-04-28',
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('Lançamento não encontrado para edição.');
    });

    it('rejeita edição que resultaria em saldo negativo', () => {
      const { result } = renderTransactionProvider(50000);

      const response = result.current.editEntry({
        entryId: 'entry-1',
        type: 'transfer' as const,
        amountInCents: 150000,
        transactionDate: '2026-04-28',
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('Saldo insuficiente para concluir a transferência.');
    });
  });
});
