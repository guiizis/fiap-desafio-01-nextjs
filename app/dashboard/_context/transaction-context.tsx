'use client';

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type {
  EditStatementEntryPayload,
  StatementEntry,
} from '../_components/interfaces/statement-panel.interfaces';
import { AccountActionType, accountReducer, createAccountState } from '../_state/account.reducer';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from '../_components/interfaces/new-transaction-panel.interfaces';
import {
  formatIsoDateToPtBr,
  getTransactionDateRange,
  toStatementDate,
} from '../_utils/transaction-date';
import { StatementEntryType } from '../_components/interfaces/transaction.interfaces';

export type TransactionContextValue = {
  balanceInCents: number;
  statementEntries: readonly StatementEntry[];
  onSubmitTransaction: (payload: NewTransactionPayload) => NewTransactionResult;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (payload: EditStatementEntryPayload) => NewTransactionResult;
};

const TransactionContext = createContext<TransactionContextValue | null>(null);

function createStatementEntry(
  { type, amountInCents }: Omit<NewTransactionPayload, 'transactionDate'>,
  statementDate: { monthLabel: string; dateLabel: string }
): StatementEntry {
  const id =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    type,
    month: statementDate.monthLabel,
    amountInCents: type === StatementEntryType.DEPOSIT ? amountInCents : -amountInCents,
    date: statementDate.dateLabel,
  };
}

type TransactionProviderProps = {
  children: ReactNode;
  initialBalanceInCents: number;
  initialStatementEntries: readonly StatementEntry[];
};

export function TransactionProvider({
  children,
  initialBalanceInCents,
  initialStatementEntries,
}: TransactionProviderProps) {
  const transactionDateRange = useMemo(() => getTransactionDateRange(), []);

  const [accountState, dispatch] = useReducer(
    accountReducer,
    createAccountState(initialBalanceInCents, initialStatementEntries)
  );

  const onSubmitTransaction = useCallback(
    (payload: NewTransactionPayload): NewTransactionResult => {
      if (
        payload.type === StatementEntryType.TRANSFER &&
        payload.amountInCents > accountState.currentBalanceInCents
      ) {
        return {
          ok: false,
          message: 'Saldo insuficiente para concluir a transferência.',
        };
      }

      const statementDate = toStatementDate(payload.transactionDate, transactionDateRange);
      if (!statementDate) {
        return {
          ok: false,
          message: `Data inválida. Selecione uma data entre ${formatIsoDateToPtBr(transactionDateRange.minDate)} e ${formatIsoDateToPtBr(transactionDateRange.maxDate)}.`,
        };
      }

      dispatch({
        type: AccountActionType.APPEND_TRANSACTION_ENTRY,
        entry: createStatementEntry(payload, statementDate),
      });

      return {
        ok: true,
      };
    },
    [accountState.currentBalanceInCents, transactionDateRange]
  );

  const onDeleteEntry = useCallback((entryId: string) => {
    dispatch({
      type: AccountActionType.DELETE_STATEMENT_ENTRY,
      entryId,
    });
  }, []);

  const onEditEntry = useCallback(
    (payload: EditStatementEntryPayload): NewTransactionResult => {
      const entryToEdit = accountState.currentStatementEntries.find(
        (entry) => entry.id === payload.entryId
      );
      if (!entryToEdit) {
        return {
          ok: false,
          message: 'Lançamento não encontrado para edição.',
        };
      }

      const statementDate = toStatementDate(payload.transactionDate, transactionDateRange);
      if (!statementDate) {
        return {
          ok: false,
          message: `Data inválida. Selecione uma data entre ${formatIsoDateToPtBr(transactionDateRange.minDate)} e ${formatIsoDateToPtBr(transactionDateRange.maxDate)}.`,
        };
      }

      const nextSignedAmountInCents =
        payload.type === StatementEntryType.DEPOSIT
          ? payload.amountInCents
          : -payload.amountInCents;
      const projectedBalanceInCents =
        accountState.currentBalanceInCents - entryToEdit.amountInCents + nextSignedAmountInCents;

      if (projectedBalanceInCents < 0) {
        return {
          ok: false,
          message: 'Saldo insuficiente para concluir a transferência.',
        };
      }

      dispatch({
        type: AccountActionType.EDIT_STATEMENT_ENTRY,
        entryId: payload.entryId,
        nextAmountInCents: payload.amountInCents,
        nextType: payload.type,
        nextMonth: statementDate.monthLabel,
        nextDate: statementDate.dateLabel,
      });

      return {
        ok: true,
      };
    },
    [accountState, transactionDateRange]
  );

  const value = useMemo<TransactionContextValue>(
    () => ({
      balanceInCents: accountState.currentBalanceInCents,
      statementEntries: accountState.currentStatementEntries,
      onSubmitTransaction,
      onDeleteEntry,
      onEditEntry,
    }),
    [accountState, onSubmitTransaction, onDeleteEntry, onEditEntry]
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactionContext(): TransactionContextValue {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }

  return context;
}
