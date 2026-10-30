'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type {
  EditStatementEntryPayload,
  NewTransactionPayload,
  StatementEntry,
  TransactionResult,
} from '../dashboard/_domain/transaction.types';
import { StatementEntryType } from '../dashboard/_domain/transaction.types';
import {
  type ApiTransaction,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useEditTransactionMutation,
  useGetAccountQuery,
} from '../dashboard/_state/bank-api';
import { formatIsoDateToPtBr, parseIsoDate } from '../dashboard/_utils/date';
import {
  useAuthSession,
  type AuthSessionStatus,
  type ServerAuthSession,
} from '../dashboard/_hooks/use-auth-session';

export type { AuthSessionStatus };

type AuthSessionContextValue = {
  session: ServerAuthSession | null;
  status: AuthSessionStatus;
  statementEntries: StatementEntry[];
  balanceInCents: number;
  onSubmitTransaction: (payload: NewTransactionPayload) => Promise<TransactionResult>;
  onDeleteStatementEntry: (entryId: string) => Promise<TransactionResult>;
  onEditStatementEntry: (payload: EditStatementEntryPayload) => Promise<TransactionResult>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function toStatementEntry(transaction: ApiTransaction): StatementEntry {
  const parsedDate = parseIsoDate(transaction.date);
  const referenceDate = parsedDate
    ? new Date(Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day, 12))
    : new Date();
  const month = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(referenceDate);

  return {
    id: transaction.id,
    month: `${month.charAt(0).toUpperCase()}${month.slice(1)}`,
    type: transaction.type === 'deposit' ? StatementEntryType.DEPOSIT : StatementEntryType.TRANSFER,
    amountInCents: transaction.amountInCents,
    date: formatIsoDateToPtBr(transaction.date),
  };
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuthSession();
  const account = useGetAccountQuery(undefined, { skip: auth.status !== 'authenticated' });
  const [createTransaction] = useCreateTransactionMutation();
  const [editTransaction] = useEditTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const runMutation = async (mutation: {
    unwrap: () => Promise<unknown>;
  }): Promise<TransactionResult> => {
    try {
      await mutation.unwrap();
      return { ok: true };
    } catch (error) {
      const data = typeof error === 'object' && error && 'data' in error ? error.data : null;
      const message =
        typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
          ? data.message
          : 'Não foi possível concluir a operação.';
      return { ok: false, message };
    }
  };

  const status: AuthSessionStatus =
    auth.status === 'authenticated' && account.isLoading ? 'loading' : auth.status;
  const statementEntries = account.data?.transactions.map(toStatementEntry) ?? [];

  return (
    <AuthSessionContext.Provider
      value={{
        session: auth.session,
        status,
        statementEntries,
        balanceInCents: account.data?.balanceInCents ?? 0,
        onSubmitTransaction: (payload) => runMutation(createTransaction(payload)),
        onDeleteStatementEntry: (entryId) => runMutation(deleteTransaction(entryId)),
        onEditStatementEntry: (payload) => runMutation(editTransaction(payload)),
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSessionContext(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error('useAuthSessionContext must be used within an AuthSessionProvider');
  }
  return context;
}
