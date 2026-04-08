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
  { title: string; description: string; cardLabel: string }
> = {
  inicio: {
    title: "Confira os servicos disponiveis",
    description: "Acesse atalhos do seu banco em um unico lugar.",
    cardLabel: "Painel inicial",
  },
  transferencias: {
    title: "Transferencias",
    description: "Consulte e organize suas transferencias com facilidade.",
    cardLabel: "Resumo de transferencias",
  },
  investimentos: {
    title: "Investimentos",
    description: "Acompanhe sua carteira e proximos passos de investimento.",
    cardLabel: "Resumo de investimentos",
  },
  "outros-servicos": {
    title: "Outros servicos",
    description: "Veja os principais servicos adicionais disponiveis na conta.",
    cardLabel: "Servicos adicionais",
  },
  "meus-cartoes": {
    title: "Meus cartoes",
    description: "Gerencie seus cartoes fisico e digital com rapidez.",
    cardLabel: "Gerenciamento de cartoes",
  },
};

export function ServicesContentPanel({ activeTab }: ServicesContentPanelProps) {
  const content = tabContent[activeTab];

  return (
    <section className="rounded-md bg-surface-soft p-5" aria-live="polite">
      <h2 className="text-title-xl font-bold text-black">{content.title}</h2>
      <p className="mt-2 text-body-md text-body">{content.description}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOptions.map((option) => (
          <article
            key={option.id}
            className="rounded-md bg-surface p-4 text-center shadow-sm"
            aria-label={option.label}
          >
            <span className="text-body-md font-semibold text-heading">{option.label}</span>
          </article>
        ))}
      </div>

      <p className="mt-4 text-body-sm font-semibold text-subtle">{content.cardLabel}</p>
    </section>
  );
}
