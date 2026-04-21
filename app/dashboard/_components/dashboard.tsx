'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { AccountSummaryCard } from './account-summary-card';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from './interfaces/new-transaction-panel.interfaces';
import type { StatementEntry } from './interfaces/statement-panel.interfaces';
import { accountReducer, createAccountState } from '../_state/account.reducer';
import {
  formatIsoDateToPtBr,
  getTransactionDateRange,
  toStatementDate,
  type TransactionStatementDate,
} from '../_utils/transaction-date';
import { DashboardContentPanel } from './dashboard-content-panel';
import { DashboardSidebarNav, type DashboardTabKey } from './dashboard-sidebar-nav';
import { StatementPanel } from './statement-panel';

const sidebarItems: readonly { key: DashboardTabKey; label: string; disabled?: boolean }[] = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'transferencias', label: 'Transferencias', disabled: true },
  { key: 'investimentos', label: 'Investimentos', disabled: true },
  { key: 'outros-servicos', label: 'Outros serviços', disabled: false },
];

type DashboardProps = {
  userFirstName: string;
  balanceInCents: number;
  statementEntries: readonly StatementEntry[];
};

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
    type: type === 'deposito' ? 'Deposito' : 'Transferencia',
    amountInCents: type === 'deposito' ? amountInCents : -amountInCents,
    date: statementDate.dateLabel,
  };
}

export function Dashboard({ userFirstName, balanceInCents, statementEntries }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('inicio');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [accountState, dispatchAccountAction] = useReducer(
    accountReducer,
    createAccountState(balanceInCents, statementEntries)
  );
  const currentDateLabel = useMemo(() => formatCurrentDateLabel(), []);
  const transactionDateRange = useMemo(() => getTransactionDateRange(), []);

  useEffect(() => {
    dispatchAccountAction({
      type: 'hydrate-from-props',
      balanceInCents,
      statementEntries,
    });
  }, [balanceInCents, statementEntries]);

  const handleSubmitTransaction = ({
    type,
    amountInCents,
    transactionDate,
  }: NewTransactionPayload): NewTransactionResult => {
    if (type === 'transferencia' && amountInCents > accountState.currentBalanceInCents) {
      return {
        ok: false,
        message: 'Saldo insuficiente para concluir a transferência.',
      };
    }

    const statementDate = toStatementDate(transactionDate, transactionDateRange);
    if (!statementDate) {
      return {
        ok: false,
        message: `Data invalida. Selecione uma data entre ${formatIsoDateToPtBr(transactionDateRange.minDate)} e ${formatIsoDateToPtBr(transactionDateRange.maxDate)}.`,
      };
    }

    dispatchAccountAction({
      type: 'append-transaction-entry',
      entry: createStatementEntry({ type, amountInCents }, statementDate),
    });

    return {
      ok: true,
    };
  };

  const handleDeleteStatementEntry = (entryId: string) => {
    dispatchAccountAction({
      type: 'delete-statement-entry',
      entryId,
    });
  };

  const handleEditStatementEntry = (entryId: string, nextAmountInCents: number) => {
    dispatchAccountAction({
      type: 'edit-statement-entry',
      entryId,
      nextAmountInCents,
    });
  };

  return (
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
          <DashboardContentPanel
            activeTab={activeTab}
            onSubmitTransaction={handleSubmitTransaction}
          />
        </div>

        <div className="desktop:col-start-3 desktop:flex desktop:h-full">
          <StatementPanel
            entries={accountState.currentStatementEntries}
            onDeleteEntry={handleDeleteStatementEntry}
            onEditEntry={handleEditStatementEntry}
          />
        </div>
      </div>
    </div>
  );
}
