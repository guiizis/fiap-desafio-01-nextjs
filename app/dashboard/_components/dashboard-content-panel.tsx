"use client";

import { useState } from "react";
import { NewTransactionPanel } from "./new-transaction-panel";
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from "./interfaces/new-transaction-panel.interfaces";
import type {
  EditStatementEntryPayload,
  EditStatementEntryResult,
  StatementEntry,
} from "./interfaces/statement-panel.interfaces";
import { ServiceUnderConstructionModal } from "./service-under-construction-modal";
import type { DashboardTabKey } from "./dashboard-sidebar-nav";
import { StatementPanel } from "./statement-panel";

type DashboardContentPanelProps = {
  activeTab: DashboardTabKey;
  onSubmitTransaction?: (payload: NewTransactionPayload) => NewTransactionResult | void;
  transactionEntries?: readonly StatementEntry[];
  editableYear?: number | null;
  onDeleteEntry?: (entryId: string) => void;
  onEditEntry?: (payload: EditStatementEntryPayload) => EditStatementEntryResult | void;
};

type ServiceOption = {
  id: string;
  label: string;
};

const serviceOptions: readonly ServiceOption[] = [
  { id: "emprestimo", label: "Empréstimo" },
  { id: "meus-cartoes", label: "Meus cartões" },
  { id: "doacoes", label: "Doações" },
  { id: "pix", label: "Pix" },
  { id: "seguros", label: "Seguros" },
  { id: "credito-celular", label: "Crédito celular" },
];

const tabContent: Record<DashboardTabKey, { title: string; description: string }> = {
  inicio: {
    title: "Confira os serviços disponíveis",
    description: "Acesse atalhos do seu banco em um único lugar.",
  },
  transacoes: {
    title: "Transações",
    description: "Consulte e organize suas transações com facilidade.",
  },
  investimentos: {
    title: "Investimentos",
    description: "Acompanhe sua carteira e próximos passos de investimento.",
  },
  "outros-servicos": {
    title: "Confira os serviços disponíveis",
    description: "Acesse atalhos do seu banco em um único lugar.",
  },
  "meus-cartoes": {
    title: "Meus cartões",
    description: "Gerencie seus cartões físico e digital com rapidez.",
  },
};

export function DashboardContentPanel({
  activeTab,
  onSubmitTransaction,
  transactionEntries = [],
  onDeleteEntry,
  onEditEntry,
}: DashboardContentPanelProps) {
  const [selectedServiceLabel, setSelectedServiceLabel] = useState<string | null>(null);

  if (activeTab === "inicio") {
    return <NewTransactionPanel onSubmitTransaction={onSubmitTransaction} />;
  }

  if (activeTab === "transacoes") {
    return (
      <StatementPanel
        title="Transações"
        ariaLabel="Painel de transações"
        entries={transactionEntries}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
      />
    );
  }

  const content = tabContent[activeTab];

  return (
    <section className="relative overflow-hidden rounded-md bg-surface-soft p-5">
      {selectedServiceLabel === "Meus cartões" ? (
        <MyCardsSection onBack={() => setSelectedServiceLabel(null)} />
      ) : (
        <>
          <h2 className="text-title-xl font-bold text-black">{content.title}</h2>
          <p className="mt-2 text-body-md text-body">{content.description}</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOptions.map((option) => (
              <article key={option.id} className="min-h-[98px] rounded-md bg-surface shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedServiceLabel(option.label)}
                  className="flex h-full w-full items-center justify-center rounded-md p-4 hover:bg-surface-muted cursor-pointer"
                >
                  <span className="text-body-md font-semibold text-heading">
                    {option.label}
                  </span>
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      {selectedServiceLabel &&
        selectedServiceLabel !== "Meus cartões" && (
          <ServiceUnderConstructionModal
            serviceLabel={selectedServiceLabel}
            onClose={() => setSelectedServiceLabel(null)}
          />
        )}
    </section>
  );
}

/* ============================= */
/* 🔥 SEÇÃO DE CARTÕES FINAL */
/* ============================= */

function MyCardsSection({ onBack }: { onBack: () => void }) {
  const [blockedPhysical, setBlockedPhysical] = useState(false);
  const [blockedDigital, setBlockedDigital] = useState(false);

  return (
    <div
      className="mt-4 rounded-xl p-6 relative overflow-hidden"
      style={{
        backgroundColor: "#E5E7E6",
        backgroundImage: "url('/dashboard/transacoes/square-bottom.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px bottom",
      }}
    >
      <button
        onClick={onBack}
        className="mb-4 text-sm text-[#004D61] hover:underline cursor-pointer"
      >
        ← Voltar
      </button>

      <h3 className="text-[20px] font-bold text-[#1F2937] mb-6">
        Meus cartões
      </h3>

      {/* CARD FÍSICO */}
      <div className="mb-8">
        <p className="text-[14px] text-[#6B7280] mb-3">Cartão físico</p>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* CARD */}
          <Card type="physical" />

          {/* BOTÕES */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="w-full md:w-[180px] bg-[#FF5031] text-white py-2 rounded-md hover:brightness-90 cursor-pointer">
              Configurar
            </button>

            <button
              onClick={() => setBlockedPhysical(!blockedPhysical)}
              className={`w-full md:w-[180px] py-2 rounded-md border cursor-pointer transition ${
                blockedPhysical
                  ? "border-green-500 text-green-500"
                  : "border-red-500 text-red-500"
              }`}
            >
              {blockedPhysical ? "Desbloquear" : "Bloquear"}
            </button>

            <span className="text-[12px] text-[#6B7280]">
              Função: Débito/Crédito
            </span>
          </div>
        </div>
      </div>

      {/* CARD DIGITAL */}
      <div>
        <p className="text-[18px] text-[#6B7280] mb-5">Cartão digital</p>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* CARD */}
          <Card type="digital" />

          {/* BOTÕES */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="w-full md:w-[180px] bg-[#FF5031] text-white py-2 rounded-md hover:brightness-90 cursor-pointer">
              Configurar
            </button>

            <button
              onClick={() => setBlockedDigital(!blockedDigital)}
              className={`w-full md:w-[180px] py-2 rounded-md border cursor-pointer transition ${
                blockedDigital
                  ? "border-green-500 text-green-500"
                  : "border-red-500 text-red-500"
              }`}
            >
              {blockedDigital ? "Desbloquear" : "Bloquear"}
            </button>

            <span className="text-[12px] text-[#6B7280]">
              Função: Débito
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= */
/* 💳 COMPONENTE CARD (REUTILIZÁVEL) */
/* ============================= */

function Card({ type }: { type: "physical" | "digital" }) {
  const isPhysical = type === "physical";

  return (
    <div className="relative w-[320px] h-[160px] rounded-xl overflow-hidden shadow-sm">
      {/* FUNDO */}
      <div
        className={`absolute inset-0 ${
          isPhysical ? "bg-[#0D5C6B]" : "bg-[#9B9B9B]"
        }`}
      />

      {/* FAIXA ESQUERDA */}
      <div
        className={`absolute inset-y-0 left-0 w-[58%] ${
          isPhysical ? "bg-[#0B4F5C]" : "bg-[#8A8A8A]"
        }`}
      />

      {/* SVG DECORATIVO */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/dashboard/transacoes/square.top.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "140px",
          opacity: isPhysical ? 0.7 : 0.5,
        }}
      />

      {/* CONTEÚDO */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 py-5 text-white">
        {/* TOPO */}
        <div className="space-y-1">
          <p className="text-[18px] italic font-semibold tracking-wide">
            Byte
          </p>
          <p className="text-[13px] opacity-80">Platinum</p>
        </div>

        {/* BASE */}
        <div className="space-y-1">
          <p className="text-[12px] opacity-90">
            Joana Fonseca Gomes
          </p>
          <p className="text-[14px] tracking-[6px]">
            ••••••••
          </p>
        </div>
      </div>
    </div>
  );
}