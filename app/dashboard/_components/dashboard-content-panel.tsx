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
  { id: 'loan', label: 'Empréstimo' },
  { id: 'my-cards', label: 'Meus cartões' },
  { id: 'donations', label: 'Doações' },
  { id: 'instant-payments', label: 'Pix' },
  { id: 'insurance', label: 'Seguros' },
  { id: 'mobile-top-up', label: 'Crédito celular' },
];

const tabContent: Record<DashboardTabKey, { title: string; description: string }> = {
  home: {
    title: 'Confira os serviços disponíveis',
    description: 'Acesse atalhos do seu banco em um único lugar.',
  },
  transactions: {
    title: 'Transações',
    description: 'Consulte e organize suas transações com facilidade.',
  },
  investments: {
    title: 'Investimentos',
    description: 'Acompanhe sua carteira e próximos passos de investimento.',
  },
  'other-services': {
    title: 'Confira os serviços disponíveis',
    description: 'Acesse atalhos do seu banco em um único lugar.',
  },
  'my-cards': {
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

  if (activeTab === 'home') {
    return <NewTransactionPanel />;
  }

  if (activeTab === 'transactions') {
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
    <section className="relative overflow-hidden rounded-md bg-surface-soft p-5" aria-live="polite">
      <div className="relative z-10">
        <h2 className="text-title-xl font-bold text-black">{content.title}</h2>
        <p className="mt-2 text-body-md text-body">{content.description}</p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceOptions.map((option) => (
            <article
              key={option.id}
              className="min-h-[98px] rounded-md bg-surface shadow-sm"
              aria-label={option.label}
            >
              <button
                type="button"
                onClick={() => setSelectedServiceLabel(option.label)}
                className="flex h-full w-full cursor-pointer items-center justify-center rounded-md p-4 text-center transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Abrir aviso do serviço ${option.label}`}
              >
                <span className="text-body-md font-semibold text-heading">{option.label}</span>
              </button>
            </article>
          ))}
        </div>
      </div>

      {selectedServiceLabel ? (
        <ServiceUnderConstructionModal
          serviceLabel={selectedServiceLabel}
          onClose={() => setSelectedServiceLabel(null)}
        />
      ) : null}
    </section>
  );
}
