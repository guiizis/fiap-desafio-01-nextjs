import Image from "next/image";
import { formatCurrencyFromCents } from "../../lib/calc";

type AccountSummaryCardProps = {
  name: string;
  dateLabel: string;
  balanceLabel: string;
  accountLabel: string;
  balanceInCents: number;
  isBalanceVisible: boolean;
  onToggleBalanceVisibility: () => void;
};

export function AccountSummaryCard({
  name,
  dateLabel,
  balanceLabel,
  accountLabel,
  balanceInCents,
  isBalanceVisible,
  onToggleBalanceVisibility,
}: AccountSummaryCardProps) {
  const displayedBalance = isBalanceVisible ? formatCurrencyFromCents(balanceInCents) : "R$ ******";

  return (
    <section
      className="min-h-[350px] rounded-md bg-primary px-6 py-7 text-surface"
      aria-label="Resumo da conta"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_340px] md:items-start">
        <div className="space-y-2">
          <h1 className="text-title-xl font-bold text-surface">Ola, {name}! :)</h1>
          <p className="text-body-sm text-menu-hover">{dateLabel}</p>
        </div>

        <div className="w-full md:pt-6">
          <p className="flex items-center gap-2 text-title-lg font-semibold text-surface">
            {balanceLabel}
            <button
              type="button"
              onClick={onToggleBalanceVisibility}
              aria-label={isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
              aria-pressed={!isBalanceVisible}
              className="inline-flex h-5 w-6 cursor-pointer items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
            >
              <Image
                src="/servicos/show-balance.svg"
                alt=""
                width={19}
                height={13}
                aria-hidden="true"
              />
            </button>
          </p>
          <span className="mt-2 block h-[2px] w-full bg-accent" />
          <p className="mt-2 text-body-md text-menu-hover">{accountLabel}</p>
          <p className="mt-1 min-w-[300px] whitespace-nowrap text-[3.2rem] leading-none text-surface">
            {displayedBalance}
          </p>
        </div>
      </div>
    </section>
  );
}
