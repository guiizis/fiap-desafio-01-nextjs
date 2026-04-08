type AccountSummaryCardProps = {
  name: string;
  dateLabel: string;
  balanceLabel: string;
  accountLabel: string;
  balanceValue: string;
};

export function AccountSummaryCard({
  name,
  dateLabel,
  balanceLabel,
  accountLabel,
  balanceValue,
}: AccountSummaryCardProps) {
  return (
    <section className="rounded-md bg-primary p-6 text-surface" aria-label="Resumo da conta">
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="space-y-2">
          <h1 className="text-title-xl font-bold text-surface">Ola, {name}! :)</h1>
          <p className="text-body-sm text-menu-hover">{dateLabel}</p>
        </div>

        <div className="md:justify-self-end">
          <p className="flex items-center gap-2 text-title-lg font-semibold text-surface">
            {balanceLabel}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-accent">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="2.2" fill="currentColor" />
            </svg>
          </p>
          <span className="mt-2 block h-[2px] w-full max-w-[140px] bg-accent" />
          <p className="mt-2 text-body-md text-menu-hover">{accountLabel}</p>
          <p className="text-[2rem] leading-none text-surface">{balanceValue}</p>
        </div>
      </div>
    </section>
  );
}
