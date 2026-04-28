'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { AuthSessionProvider, useAuthSessionContext } from '@/app/context/auth-session-context';
import { AccountSummaryCard } from './_components/account-summary-card';
import { DashboardHeader } from './_components/dashboard-header';
import type { StatementEntry } from './_components/interfaces/statement-panel.interfaces';
import { accountReducer, createAccountState } from './_state/account.reducer';
import { getTimestampFromPtBrDate } from './_utils/transaction-date';
import {
  DashboardSidebarItem,
  DashboardSidebarNav,
  type DashboardTabKey,
} from './_components/dashboard-sidebar-nav';
import { StatementPanel } from './_components/statement-panel';
import type { AuthSession } from '@/app/lib/auth-session';
import { ReactNode } from 'react';
import { TransactionProvider } from './_context';
import { StatementEntryType } from './_components/interfaces/transaction.interfaces';

const sidebarItems: readonly DashboardSidebarItem[] = [
  { key: 'home', label: 'Início', link: '/dashboard/home' },
  { key: 'transactions', label: 'Transações', link: '/dashboard/transactions' },
  { key: 'investments', label: 'Investimentos', link: '/dashboard/investments', disabled: true },
  {
    key: 'other-services',
    label: 'Outros serviços',
    link: '/dashboard/other-services',
    disabled: false,
  },
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
    type: entry.type as StatementEntryType,
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

  const handleTabChange = (item: DashboardSidebarItem) => {
    setActiveTab(item.key);
    redirect(item.link);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <DashboardHeader userName={session.user.name} />

      <TransactionProvider
        initialBalanceInCents={balanceInCents}
        initialStatementEntries={statementEntries}
      >
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[688px] px-4 pb-10 pt-8 md:pb-10 md:pt-10 desktop:max-w-[1140px] desktop:px-0 desktop:pb-8 desktop:pt-4">
            <div className="grid gap-6 desktop:grid-cols-[142px_minmax(0,1fr)_240px] desktop:items-stretch desktop:gap-4">
              <div className="desktop:flex desktop:h-full">
                <DashboardSidebarNav
                  items={sidebarItems}
                  activeItem={activeTab}
                  onChange={handleTabChange}
                />
              </div>

              <div className="space-y-6 desktop:col-start-2 desktop:min-w-0 desktop:space-y-3">
                <AccountSummaryCard
                  name={userFirstName}
                  dateLabel={currentDateLabel}
                  balanceLabel="Saldo"
                  accountLabel="Conta corrente"
                  balanceInCents={balanceInCents}
                  isBalanceVisible={isBalanceVisible}
                  onToggleBalanceVisibility={() => setIsBalanceVisible((current) => !current)}
                />
                {children}
              </div>

              <div className="desktop:col-start-3 desktop:flex desktop:h-full">
                <StatementPanel title="Extrato" entries={visibleStatementEntries} />
              </div>
            </div>
          </div>
        </main>
      </TransactionProvider>
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
