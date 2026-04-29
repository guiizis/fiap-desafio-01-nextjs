'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  AUTH_SESSION_CHANGED_EVENT,
  AUTH_SESSION_STORAGE_KEY,
  parseAuthSession,
  setAuthSession,
  type AuthSession,
} from '../lib/auth-session';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from '../dashboard/_components/interfaces/new-transaction-panel.interfaces';
import type { EditStatementEntryPayload } from '../dashboard/_components/interfaces/statement-panel.interfaces';
import type { StatementEntry } from '../dashboard/_components/interfaces/statement-panel.interfaces';
import {
  AccountActionType,
  accountReducer,
  createAccountState,
} from '../dashboard/_state/account.reducer';
import {
  formatIsoDateToPtBr,
  getTransactionDateRange,
  toStatementDate,
  type TransactionStatementDate,
} from '../dashboard/_utils/transaction-date';
import {
  StatementEntryType,
  TransactionType,
  toStatementEntryType,
} from '../dashboard/_components/interfaces/statement-panel.interfaces';

export type AuthSessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthSessionContextValue = {
  session: AuthSession | null;
  status: AuthSessionStatus;
  handleSubmitTransaction?: (payload: NewTransactionPayload) => NewTransactionResult;
  handleDeleteStatementEntry?: (entryId: string) => void;
  handleEditStatementEntry?: (payload: EditStatementEntryPayload) => NewTransactionResult;
  statementEntries?: StatementEntry[];
  balanceInCents?: number;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

const SERVER_SNAPSHOT = '__server_snapshot__';
const EMPTY_SNAPSHOT = '__empty_snapshot__';

function createStatementEntry(
  { type, amountInCents }: Omit<NewTransactionPayload, 'transactionDate'>,
  statementDate: TransactionStatementDate
): StatementEntry {
  const id =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    month: statementDate.monthLabel,
    type: toStatementEntryType(type),
    amountInCents: type === TransactionType.DEPOSIT ? amountInCents : -amountInCents,
    date: statementDate.dateLabel,
  };
}

function subscribe(onStoreChange: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.storageArea !== window.sessionStorage) {
      return;
    }

    if (event.key && event.key !== AUTH_SESSION_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  };

  const handleSessionChangedEvent = () => onStoreChange();

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChangedEvent);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChangedEvent);
  };
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function getClientSnapshot() {
  return window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const serializedSession = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const session =
    serializedSession === SERVER_SNAPSHOT || serializedSession === EMPTY_SNAPSHOT
      ? null
      : parseAuthSession(serializedSession);

  useEffect(() => {
    if (!session || serializedSession === SERVER_SNAPSHOT || serializedSession === EMPTY_SNAPSHOT) {
      return;
    }

    const normalizedSerializedSession = JSON.stringify(session);

    if (normalizedSerializedSession !== serializedSession) {
      setAuthSession(session);
    }
  }, [serializedSession, session]);

  const status: AuthSessionStatus =
    serializedSession === SERVER_SNAPSHOT
      ? 'loading'
      : session
        ? 'authenticated'
        : 'unauthenticated';

  // Account state management
  const initialBalanceInCents = session?.user.accountBalanceInCents ?? 0;
  const initialStatementEntries = session?.user.statementEntries ?? [];
  const [accountState, dispatchAccountAction] = useReducer(
    accountReducer,
    createAccountState(initialBalanceInCents, initialStatementEntries)
  );
  const transactionDateRange = getTransactionDateRange();
  const isHydrated = useRef(false);

  // Hydrate from session on mount (only once)
  useEffect(() => {
    if (isHydrated.current) {
      return;
    }
    isHydrated.current = true;

    if (session?.user.accountBalanceInCents !== undefined || session?.user.statementEntries) {
      dispatchAccountAction({
        type: AccountActionType.HYDRATE_FROM_PROPS,
        balanceInCents: session?.user.accountBalanceInCents ?? 0,
        statementEntries: session?.user.statementEntries ?? [],
      });
    }
  }, []); // Empty deps - only run once on mount

  const handleSubmitTransaction = ({
    type,
    amountInCents,
    transactionDate,
  }: NewTransactionPayload): NewTransactionResult => {
    if (type === TransactionType.TRANSFER && amountInCents > accountState.currentBalanceInCents) {
      return {
        ok: false,
        message: 'Saldo insuficiente para concluir a transferência.',
      };
    }

    const statementDate = toStatementDate(transactionDate, transactionDateRange);
    if (!statementDate) {
      return {
        ok: false,
        message: `Data inválida. Selecione uma data entre ${formatIsoDateToPtBr(transactionDateRange.minDate)} e ${formatIsoDateToPtBr(transactionDateRange.maxDate)}.`,
      };
    }

    const entry = createStatementEntry({ type, amountInCents }, statementDate);
    dispatchAccountAction({
      type: AccountActionType.APPEND_TRANSACTION_ENTRY,
      entry,
    });

    return {
      ok: true,
    };
  };

  const handleDeleteStatementEntry = (entryId: string) => {
    dispatchAccountAction({
      type: AccountActionType.DELETE_STATEMENT_ENTRY,
      entryId,
    });
  };

  const handleEditStatementEntry = ({
    entryId,
    type,
    amountInCents,
    transactionDate,
  }: EditStatementEntryPayload): NewTransactionResult => {
    const entryToEdit = accountState.currentStatementEntries.find((entry) => entry.id === entryId);
    if (!entryToEdit) {
      return {
        ok: false,
        message: 'Lançamento não encontrado para edição.',
      };
    }

    const statementDate = toStatementDate(transactionDate, transactionDateRange);
    if (!statementDate) {
      return {
        ok: false,
        message: `Data inválida. Selecione uma data entre ${formatIsoDateToPtBr(transactionDateRange.minDate)} e ${formatIsoDateToPtBr(transactionDateRange.maxDate)}.`,
      };
    }

    const nextSignedAmountInCents =
      type === TransactionType.DEPOSIT ? amountInCents : -amountInCents;
    const projectedBalanceInCents =
      accountState.currentBalanceInCents - entryToEdit.amountInCents + nextSignedAmountInCents;

    if (projectedBalanceInCents < 0) {
      return {
        ok: false,
        message: 'Saldo insuficiente para concluir a transferência.',
      };
    }

    dispatchAccountAction({
      type: AccountActionType.EDIT_STATEMENT_ENTRY,
      entryId,
      nextAmountInCents: amountInCents,
      nextType:
        type === TransactionType.DEPOSIT ? StatementEntryType.DEPOSIT : StatementEntryType.TRANSFER,
      nextMonth: statementDate.monthLabel,
      nextDate: statementDate.dateLabel,
    });

    return {
      ok: true,
    };
  };

  return (
    <AuthSessionContext.Provider
      value={{
        session,
        status,
        handleSubmitTransaction,
        handleDeleteStatementEntry,
        handleEditStatementEntry,
        statementEntries: accountState.currentStatementEntries,
        balanceInCents: accountState.currentBalanceInCents,
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
