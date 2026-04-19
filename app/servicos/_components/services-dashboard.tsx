"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { AccountSummaryCard } from "./account-summary-card";
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from "./interfaces/new-transaction-panel.interfaces";
import type { StatementEntry } from "./interfaces/statement-panel.interfaces";
import {
  accountReducer,
  createAccountState,
} from "../_state/account.reducer";
import { ServicesContentPanel } from "./services-content-panel";
import { ServicesSidebarNav, type ServicesTabKey } from "./services-sidebar-nav";
import { StatementPanel } from "./statement-panel";

const sidebarItems: readonly { key: ServicesTabKey; label: string; disabled?: boolean }[] = [
  { key: "inicio", label: "Inicio" },
  { key: "transferencias", label: "Transferencias", disabled: true },
  { key: "investimentos", label: "Investimentos", disabled: true },
  { key: "outros-servicos", label: "Outros servicos", disabled: false },
];

type ServicesDashboardProps = {
  userFirstName: string;
  balanceInCents: number;
  statementEntries: readonly StatementEntry[];
};

function formatCurrentDateLabel() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    timeZone: "America/Sao_Paulo",
  }).format(now);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(now);

  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date}`;
}

function createStatementEntry({
  type,
  amountInCents,
}: NewTransactionPayload): StatementEntry {
  const now = new Date();
  const month = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(now);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(now);
  const id = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    month: `${month.charAt(0).toUpperCase()}${month.slice(1)}`,
    type: type === "deposito" ? "Deposito" : "Transferencia",
    amountInCents: type === "deposito" ? amountInCents : -amountInCents,
    date,
  };
}

export function ServicesDashboard({
  userFirstName,
  balanceInCents,
  statementEntries,
}: ServicesDashboardProps) {
  const [activeTab, setActiveTab] = useState<ServicesTabKey>("inicio");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [accountState, dispatchAccountAction] = useReducer(
    accountReducer,
    createAccountState(balanceInCents, statementEntries)
  );
  const currentDateLabel = useMemo(() => formatCurrentDateLabel(), []);

  useEffect(() => {
    dispatchAccountAction({
      type: "hydrate-from-props",
      balanceInCents,
      statementEntries,
    });
  }, [balanceInCents, statementEntries]);

  const handleSubmitTransaction = ({
    type,
    amountInCents,
  }: NewTransactionPayload): NewTransactionResult => {
    if (type === "transferencia" && amountInCents > accountState.currentBalanceInCents) {
      return {
        ok: false,
        message: "Saldo insuficiente para concluir a transferência.",
      };
    }

    dispatchAccountAction({
      type: "append-transaction-entry",
      entry: createStatementEntry({ type, amountInCents }),
    });

    return {
      ok: true,
    };
  };

  const handleDeleteStatementEntry = (entryId: string) => {
    dispatchAccountAction({
      type: "delete-statement-entry",
      entryId,
    });
  };

  const handleEditStatementEntry = (entryId: string, nextAmountInCents: number) => {
    dispatchAccountAction({
      type: "edit-statement-entry",
      entryId,
      nextAmountInCents,
    });
  };

  return (
    <div className="mx-auto w-full max-w-[688px] px-4 pb-10 pt-8 md:pb-10 md:pt-10 desktop:max-w-[1140px] desktop:px-0 desktop:pb-8 desktop:pt-4">
      <div className="grid gap-6 desktop:grid-cols-[142px_minmax(0,1fr)_240px] desktop:items-stretch desktop:gap-4">
        <div className="desktop:flex desktop:h-full">
          <ServicesSidebarNav items={sidebarItems} activeItem={activeTab} onChange={setActiveTab} />
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
          <ServicesContentPanel
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
