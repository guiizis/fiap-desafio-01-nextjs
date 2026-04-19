"use client";

import { useEffect, useMemo, useState } from "react";
import { AccountSummaryCard } from "./account-summary-card";
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from "./interfaces/new-transaction-panel.interfaces";
import type { StatementEntry } from "./interfaces/statement-panel.interfaces";
import { ServicesContentPanel } from "./services-content-panel";
import { ServicesSidebarNav, type ServicesTabKey } from "./services-sidebar-nav";
import { StatementPanel } from "./statement-panel";

const sidebarItems: readonly { key: ServicesTabKey; label: string; disabled?: boolean }[] = [
  { key: "inicio", label: "Inicio" },
  { key: "transferencias", label: "Transferencias", disabled: true },
  { key: "investimentos", label: "Investimentos", disabled: true },
  { key: "outros-servicos", label: "Outros servicos", disabled: true },
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
  const [currentBalanceInCents, setCurrentBalanceInCents] = useState(balanceInCents);
  const [currentStatementEntries, setCurrentStatementEntries] = useState<StatementEntry[]>([
    ...statementEntries,
  ]);
  const currentDateLabel = useMemo(() => formatCurrentDateLabel(), []);

  useEffect(() => {
    setCurrentBalanceInCents(balanceInCents);
  }, [balanceInCents]);

  useEffect(() => {
    setCurrentStatementEntries([...statementEntries]);
  }, [statementEntries]);

  const handleSubmitTransaction = ({
    type,
    amountInCents,
  }: NewTransactionPayload): NewTransactionResult => {
    if (type === "transferencia" && amountInCents > currentBalanceInCents) {
      return {
        ok: false,
        message: "Saldo insuficiente para concluir a transferência.",
      };
    }

    setCurrentBalanceInCents((currentValue) =>
      type === "deposito" ? currentValue + amountInCents : currentValue - amountInCents
    );
    setCurrentStatementEntries((currentValue) => [
      createStatementEntry({ type, amountInCents }),
      ...currentValue,
    ]);

    return {
      ok: true,
    };
  };

  const handleDeleteStatementEntry = (entryId: string) => {
    setCurrentStatementEntries((currentEntries) => {
      const entryToDelete = currentEntries.find((entry) => entry.id === entryId);

      if (!entryToDelete) {
        return currentEntries;
      }

      setCurrentBalanceInCents((currentBalance) => currentBalance - entryToDelete.amountInCents);

      return currentEntries.filter((entry) => entry.id !== entryId);
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 pb-8 pt-4 md:px-0">
      <div className="grid gap-4 lg:grid-cols-[176px_minmax(0,1fr)_240px] lg:items-start">
        <ServicesSidebarNav items={sidebarItems} activeItem={activeTab} onChange={setActiveTab} />

        <div className="space-y-3">
          <AccountSummaryCard
            name={userFirstName}
            dateLabel={currentDateLabel}
            balanceLabel="Saldo"
            accountLabel="Conta corrente"
            balanceInCents={currentBalanceInCents}
            isBalanceVisible={isBalanceVisible}
            onToggleBalanceVisibility={() => setIsBalanceVisible((current) => !current)}
          />
          <ServicesContentPanel
            activeTab={activeTab}
            onSubmitTransaction={handleSubmitTransaction}
          />
        </div>

        <StatementPanel entries={currentStatementEntries} onDeleteEntry={handleDeleteStatementEntry} />
      </div>
    </div>
  );
}
