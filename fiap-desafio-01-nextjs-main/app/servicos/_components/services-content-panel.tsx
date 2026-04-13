import { NewTransactionPanel } from "./new-transaction-panel";
import type { ServicesTabKey } from "./services-sidebar-nav";

type ServicesContentPanelProps = {
  activeTab: ServicesTabKey;
};

type ServiceOption = {
  id: string;
  label: string;
};

const serviceOptions: readonly ServiceOption[] = [
  { id: "emprestimo", label: "Emprestimo" },
  { id: "meus-cartoes", label: "Meus cartoes" },
  { id: "doacoes", label: "Doacoes" },
  { id: "pix", label: "Pix" },
  { id: "seguros", label: "Seguros" },
  { id: "credito-celular", label: "Credito celular" },
];

const tabContent: Record<
  ServicesTabKey,
  { title: string; description: string }
> = {
  inicio: {
    title: "Confira os servicos disponiveis",
    description: "Acesse atalhos do seu banco em um unico lugar.",
  },
  transferencias: {
    title: "Transferencias",
    description: "Consulte e organize suas transferencias com facilidade.",
  },
  investimentos: {
    title: "Investimentos",
    description: "Acompanhe sua carteira e proximos passos de investimento.",
  },
  "outros-servicos": {
    title: "Confira os servicos disponiveis",
    description: "Acesse atalhos do seu banco em um unico lugar.",
  },
  "meus-cartoes": {
    title: "Meus cartoes",
    description: "Gerencie seus cartoes fisico e digital com rapidez.",
  },
};

export function ServicesContentPanel({ activeTab }: ServicesContentPanelProps) {
  if (activeTab === "inicio") {
    return <NewTransactionPanel />;
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
              className="flex min-h-[98px] items-center justify-center rounded-md bg-surface p-4 text-center shadow-sm"
              aria-label={option.label}
            >
              <span className="text-body-md font-semibold text-heading">{option.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
