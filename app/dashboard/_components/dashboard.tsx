'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { AccountSummaryCard } from './account-summary-card';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from './interfaces/new-transaction-panel.interfaces';
import type { EditStatementEntryPayload, StatementEntry } from './interfaces/statement-panel.interfaces';
import {
  StatementEntryType,
  TransactionType,
  toStatementEntryType,
} from './interfaces/statement-panel.interfaces';
import {
  AccountActionType,
  accountReducer,
  createAccountState,
} from '../_state/account.reducer';
import {
  formatIsoDateToPtBr,
  getTimestampFromPtBrDate,
  getTransactionDateRange,
  toStatementDate,
  type TransactionStatementDate,
} from '../_utils/transaction-date';
import { DashboardContentPanel } from './dashboard-content-panel';
import { DashboardSidebarNav, type DashboardTabKey } from './dashboard-sidebar-nav';
import { StatementPanel } from './statement-panel';

const sidebarItems: readonly { key: DashboardTabKey; label: string; disabled?: boolean }[] = [
  { key: 'home', label: 'Início' },
  { key: 'transactions', label: 'Transações' },
  { key: 'investments', label: 'Investimentos', disabled: true },
  { key: 'other-services', label: 'Outros serviços', disabled: false },
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
    type: toStatementEntryType(type),
    amountInCents: type === TransactionType.DEPOSIT ? amountInCents : -amountInCents,
    date: statementDate.dateLabel,
  };
}

export function Dashboard({ userFirstName, balanceInCents, statementEntries }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('home');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [accountState, dispatchAccountAction] = useReducer(
    accountReducer,
    createAccountState(balanceInCents, statementEntries)
  );
  const currentDateLabel = useMemo(() => formatCurrentDateLabel(), []);
  const transactionDateRange = useMemo(() => getTransactionDateRange(), []);

  useEffect(() => {
    dispatchAccountAction({
      type: AccountActionType.HYDRATE_FROM_PROPS,
      balanceInCents,
      statementEntries,
    });
  }, [balanceInCents, statementEntries]);

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

    dispatchAccountAction({
      type: AccountActionType.APPEND_TRANSACTION_ENTRY,
      entry: createStatementEntry({ type, amountInCents }, statementDate),
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
      nextType: type === TransactionType.DEPOSIT
        ? StatementEntryType.DEPOSIT
        : StatementEntryType.TRANSFER,
      nextMonth: statementDate.monthLabel,
      nextDate: statementDate.dateLabel,
    });

    return {
      ok: true,
    };
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
            transactionEntries={orderedStatementEntries}
            onDeleteEntry={handleDeleteStatementEntry}
            onEditEntry={handleEditStatementEntry}
          />
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
  );
}
