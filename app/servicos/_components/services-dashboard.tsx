"use client";

import { useState } from "react";
import { AccountSummaryCard } from "./account-summary-card";
import { ServicesContentPanel } from "./services-content-panel";
import { ServicesSidebarNav, type ServicesTabKey } from "./services-sidebar-nav";
import { StatementPanel } from "./statement-panel";

const sidebarItems: readonly { key: ServicesTabKey; label: string }[] = [
  { key: "inicio", label: "Inicio" },
  { key: "transferencias", label: "Transferencias" },
  { key: "investimentos", label: "Investimentos" },
  { key: "outros-servicos", label: "Outros servicos" },
  { key: "meus-cartoes", label: "Meus cartoes" },
];

const statementEntries = [
  { id: "1", month: "Novembro", type: "Deposito", value: "R$ 150", date: "18/11/2022" },
  { id: "2", month: "Novembro", type: "Deposito", value: "R$ 100", date: "21/11/2022" },
  { id: "3", month: "Novembro", type: "Deposito", value: "R$ 50", date: "21/11/2022" },
  { id: "4", month: "Novembro", type: "Transferencia", value: "-R$ 500", date: "21/11/2022" },
] as const;

export function ServicesDashboard() {
  const [activeTab, setActiveTab] = useState<ServicesTabKey>("inicio");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 md:px-6">
      <div className="grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)_250px]">
        <ServicesSidebarNav items={sidebarItems} activeItem={activeTab} onChange={setActiveTab} />

        <div className="space-y-4">
          <AccountSummaryCard
            name="Joana"
            dateLabel="Quinta-feira, 08/09/2024"
            balanceLabel="Saldo"
            accountLabel="Conta corrente"
            balanceValue="R$ 2.500,00"
          />
          <ServicesContentPanel activeTab={activeTab} />
        </div>

        <StatementPanel entries={statementEntries} />
      </div>
    </div>
  );
}
