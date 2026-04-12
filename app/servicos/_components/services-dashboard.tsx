"use client";

import { useState } from "react";
import { AccountSummaryCard } from "./account-summary-card";
import { ServicesContentPanel } from "./services-content-panel";
import { ServicesSidebarNav, type ServicesTabKey } from "./services-sidebar-nav";
import { StatementPanel } from "./statement-panel";

const sidebarItems: readonly { key: ServicesTabKey; label: string; disabled?: boolean }[] = [
  { key: "inicio", label: "Inicio" },
  { key: "transferencias", label: "Transferencias", disabled: true },
  { key: "investimentos", label: "Investimentos", disabled: true },
  { key: "outros-servicos", label: "Outros servicos", disabled: true },
];

const statementEntries = [
  { id: "1", month: "Novembro", type: "Deposito", value: "R$ 150", date: "18/11/2022" },
  { id: "2", month: "Novembro", type: "Deposito", value: "R$ 100", date: "21/11/2022" },
  { id: "3", month: "Novembro", type: "Deposito", value: "R$ 50", date: "21/11/2022" },
  { id: "4", month: "Novembro", type: "Transferencia", value: "-R$ 500", date: "21/11/2022" },
] as const;

export function ServicesDashboard() {
  const [activeTab, setActiveTab] = useState<ServicesTabKey>("inicio");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 pb-8 pt-4 md:px-0">
      <div className="grid gap-4 lg:grid-cols-[176px_minmax(0,1fr)_240px] lg:items-start">
        <ServicesSidebarNav items={sidebarItems} activeItem={activeTab} onChange={setActiveTab} />

        <div className="space-y-3">
          <AccountSummaryCard
            name="Joana"
            dateLabel="Quinta-feira, 08/09/2024"
            balanceLabel="Saldo"
            accountLabel="Conta corrente"
            balanceValue="R$ 2.500,00"
            isBalanceVisible={isBalanceVisible}
            onToggleBalanceVisibility={() => setIsBalanceVisible((current) => !current)}
          />
          <ServicesContentPanel activeTab={activeTab} />
        </div>

        <StatementPanel entries={statementEntries} />
      </div>
    </div>
  );
}
