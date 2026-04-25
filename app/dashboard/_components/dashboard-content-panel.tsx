'use client';

import { useState } from 'react';
import { NewTransactionPanel } from './new-transaction-panel';
import type {
  NewTransactionPayload,
  NewTransactionResult,
} from './interfaces/new-transaction-panel.interfaces';
import type {
  EditStatementEntryPayload,
  EditStatementEntryResult,
  StatementEntry,
} from './interfaces/statement-panel.interfaces';
import { ServiceUnderConstructionModal } from './service-under-construction-modal';
import type { DashboardTabKey } from './dashboard-sidebar-nav';
import { StatementPanel } from './statement-panel';

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
  { id: 'emprestimo', label: 'Empréstimo' },
  { id: 'meus-cartoes', label: 'Meus cartões' },
  { id: 'doacoes', label: 'Doações' },
  { id: 'pix', label: 'Pix' },
  { id: 'seguros', label: 'Seguros' },
  { id: 'credito-celular', label: 'Crédito celular' },
];

const tabContent: Record<DashboardTabKey, { title: string; description: string }> = {
  inicio: {
    title: 'Confira os serviços disponíveis',
    description: 'Acesse atalhos do seu banco em um único lugar.',
  },
  transacoes: {
    title: 'Transações',
    description: 'Consulte e organize suas transações com facilidade.',
  },
  investimentos: {
    title: 'Investimentos',
    description: 'Acompanhe sua carteira e próximos passos de investimento.',
  },
  'outros-servicos': {
    title: 'Confira os serviços disponíveis',
    description: 'Acesse atalhos do seu banco em um único lugar.',
  },
  'meus-cartoes': {
    title: 'Meus cartões',
    description: 'Gerencie seus cartões físico e digital com rapidez.',
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

  if (activeTab === 'inicio') {
    return <NewTransactionPanel onSubmitTransaction={onSubmitTransaction} />;
  }

  if (activeTab === 'transacoes') {
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
      <div>
        <h2 className="text-title-xl font-bold text-black">{content.title}</h2>
        <p className="mt-2 text-body-md text-body">{content.description}</p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceOptions.map((option) => (
            <article key={option.id} className="min-h-[98px] rounded-md bg-surface shadow-sm">
              <button
                type="button"
                onClick={() => setSelectedServiceLabel(option.label)}
                className="flex h-full w-full items-center justify-center rounded-md p-4 hover:bg-surface-muted"
              >
                <span className="text-body-md font-semibold text-heading">{option.label}</span>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* 🔥 AQUI A MÁGICA */}
      {selectedServiceLabel === 'Meus cartões' ? (
        <MyCardsSection />
      ) : selectedServiceLabel ? (
        <ServiceUnderConstructionModal
          serviceLabel={selectedServiceLabel}
          onClose={() => setSelectedServiceLabel(null)}
        />
      ) : null}
    </section>
  );
}

/* ============================= */
/* SEÇÃO DE CARTÕES (IGUAL Figma) */
/* ============================= */

function MyCardsSection() {
  const [blockedPhysical, setBlockedPhysical] = useState(false);
  const [blockedDigital, setBlockedDigital] = useState(false);

  return (
    <div className="mt-6 rounded-md p-10 bg-[var(--section-container-bg)]">
      <h3 className="mb-7 text-2xl font-extrabold text-black-800 font-[var(--font-sans)]">
        Meus cartões
      </h3>

      {/* CARTÃO FÍSICO */}
      <div className="mb-6">
        <p className="mb-2 text-black text-xl">Cartão físico</p>

        <div className="flex items-center justify-between">
          {/* CARD */}
          <div className="h-45 w-90 rounded-md bg-[var(--Cartao-fisico-bg)] p-5 text-white">
            <p className="text-sm font-semibold mb-1">Byte</p>
            <p className="text-xs opacity-80">Platinum</p>

            <div className="mt-5 text-xs pb-5">Joana Fonseca Gomes</div>
            <div className="text-xs tracking-widest">••••••••</div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col items-end gap-2">
            <button className="cursor-pointer w-40 rounded-md bg-orange-500 py-2 text-sm font-medium text-white hover:scale-105 active:scale-95 transition-all duration-300">
              Configurar
            </button>

            {/* BOTÃO ANIMADO */}
            <button
              onClick={() => setBlockedPhysical(!blockedPhysical)}
              className={`relative overflow-hidden cursor-pointer w-40 rounded-md border py-2 text-sm font-medium transition-all duration-500 ease-out
              ${
                blockedPhysical
                  ? "border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                  : "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
              }`}
            >
              {/* FUNDO ANIMADO */}
              <span
                className={`absolute inset-0 transition-transform duration-500 ease-out
                ${
                  blockedPhysical
                    ? "bg-green-500 translate-x-0"
                    : "bg-red-500 -translate-x-full"
                }`}
              />

              {/* TEXTO */}
              <span className="relative z-10 text-white">
                {blockedPhysical ? "Desbloquear" : "Bloquear"}
              </span>
            </button>

            <span className="text-xs text-gray-500 self-center">
              Função: Débito/Crédito
            </span>
          </div>
        </div>
      </div>

      {/* CARTÃO DIGITAL */}
      <div>
        <p className="mb-2 text-black text-xl">Cartão digital</p>

        <div className="flex items-center justify-between">
          {/* CARD */}
          <div className="h-45 w-90 rounded-md bg-[var(--Cartao-virtual-bg)] p-5 text-white">
            <p className="text-sm font-semibold mb-1">Byte</p>
            <p className="text-xs opacity-80">Platinum</p>

            <div className="mt-5 text-xs pb-5">Joana Fonseca Gomes</div>
            <div className="text-xs tracking-widest">••••••••</div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col items-end gap-2">
            <button className="cursor-pointer w-40 rounded-md bg-orange-500 py-2 text-sm font-medium text-white hover:scale-105 active:scale-95 transition-all duration-300">
              Configurar
            </button>

            {/* BOTÃO ANIMADO */}
            <button
              onClick={() => setBlockedDigital(!blockedDigital)}
              className={`relative overflow-hidden cursor-pointer w-40 rounded-md border py-2 text-sm font-medium transition-all duration-500 ease-out
              ${
                blockedDigital
                  ? "border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                  : "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
              }`}
            >
              {/* FUNDO ANIMADO */}
              <span
                className={`absolute inset-0 transition-transform duration-500 ease-out
                ${
                  blockedDigital
                    ? "bg-green-500 translate-x-0"
                    : "bg-red-500 -translate-x-full"
                }`}
              />

              {/* TEXTO */}
              <span className="relative z-10 text-white">
                {blockedDigital ? "Desbloquear" : "Bloquear"}
              </span>
            </button>

            <span className="text-xs text-gray-500 self-center">
              Função: Débito
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCardsSection;