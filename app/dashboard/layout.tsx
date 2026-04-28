'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSessionProvider, useAuthSessionContext } from '@/app/lib/auth-session-context';
import { AccountSummaryCard } from './_components/account-summary-card';
import { DashboardHeader } from './_components/dashboard-header';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from './_components/interfaces/new-transaction-panel.interfaces';
import type {
  EditStatementEntryPayload,
  StatementEntry,
} from './_components/interfaces/statement-panel.interfaces';
import {
  StatementEntryType,
  TransactionType,
  toStatementEntryType,
} from './_components/interfaces/statement-panel.interfaces';
import { AccountActionType, accountReducer, createAccountState } from './_state/account.reducer';
import {
  formatIsoDateToPtBr,
  getTimestampFromPtBrDate,
  getTransactionDateRange,
  toStatementDate,
  type TransactionStatementDate,
} from './_utils/transaction-date';
import { DashboardSidebarNav, type DashboardTabKey } from './_components/dashboard-sidebar-nav';
import { StatementPanel } from './_components/statement-panel';
import type { AuthSession } from '@/app/lib/auth-session';
import { ReactNode } from 'react';

const sidebarItems: readonly { key: DashboardTabKey; label: string; disabled?: boolean }[] = [
  { key: 'home', label: 'Início' },
  { key: 'transactions', label: 'Transações' },
  { key: 'investments', label: 'Investimentos', disabled: true },
  { key: 'other-services', label: 'Outros serviços', disabled: false },
];

function getUserFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/);
  return firstName || fullName;
}

function normalizeStatementEntries(
  entries: AuthSession['user']['statementEntries']
): StatementEntry[] {
  return entries.map((entry) => ({
    ...entry,
    type: toStatementEntryType(entry.type as TransactionType),
  }));
}

function formatCurrentDateLabel() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(now);
  const date = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(now);

  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date}`;
}

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

function DashboardLayoutContent({
  session,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  const userFirstName = getUserFirstName(session.user.name);
  const balanceInCents = session.user.accountBalanceInCents;
  const statementEntries = normalizeStatementEntries(session.user.statementEntries);

  const [activeTab, setActiveTab] = useState<DashboardTabKey>('home');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [accountState, dispatchAccountAction] = useReducer(
    accountReducer,
    createAccountState(balanceInCents, statementEntries)
  );
  const currentDateLabel = useMemo(() => formatCurrentDateLabel(), []);
  const transactionDateRange = useMemo(() => getTransactionDateRange(), []);

  const orderedStatementEntries = useMemo(() => {
    return [...accountState.currentStatementEntries].sort((entryA, entryB) => {
      const timestampA = getTimestampFromPtBrDate(entryA.date);
      const timestampB = getTimestampFromPtBrDate(entryB.date);

      if (timestampA === null && timestampB === null) {
        return 0;
      }

      if (timestampA === null) {
        return 1;
      }

      if (timestampB === null) {
        return -1;
      }

      return timestampB - timestampA;
    });
  }, [accountState.currentStatementEntries]);

  const visibleStatementEntries = useMemo(() => {
    return orderedStatementEntries.slice(0, 6);
  }, [orderedStatementEntries]);

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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <DashboardHeader userName={session.user.name} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[688px] px-4 pb-10 pt-8 md:pb-10 md:pt-10 desktop:max-w-[1140px] desktop:px-0 desktop:pb-8 desktop:pt-4">
          <div className="grid gap-6 desktop:grid-cols-[142px_minmax(0,1fr)_240px] desktop:items-stretch desktop:gap-4">
            <div className="desktop:flex desktop:h-full">
              <DashboardSidebarNav
                items={sidebarItems}
                activeItem={activeTab}
                onChange={setActiveTab}
              />
            </div>

            <div className="space-y-6 desktop:col-start-2 desktop:min-w-0 desktop:space-y-3">
              <AccountSummaryCard
                name={userFirstName}
                dateLabel={currentDateLabel}
                balanceLabel="Saldo"
                accountLabel="Conta corrente"
                balanceInCents={accountState.currentBalanceInCents}
                isBalanceVisible={isBalanceVisible}
                onToggleBalanceVisibility={() => setIsBalanceVisible((current) => !current)}
              />
              {children}
            </div>

            <div className="desktop:col-start-3 desktop:flex desktop:h-full">
              <StatementPanel
                title="Extrato"
                entries={visibleStatementEntries}
                onDeleteEntry={handleDeleteStatementEntry}
                onEditEntry={handleEditStatementEntry}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { session, status } = useAuthSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/home/login');
    }
  }, [status, router]);

  if (status !== 'authenticated' || !session) {
    return null;
  }

  return <DashboardLayoutContent session={session}>{children}</DashboardLayoutContent>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthSessionProvider>
  );
}
