import type { StatementEntry } from "./interfaces/statement-panel.interfaces";
import { formatCurrencyFromCents } from "../../lib/calc";

type StatementPanelProps = {
  entries: readonly StatementEntry[];
};

export function StatementPanel({ entries }: StatementPanelProps) {
  return (
    <aside className="rounded-md bg-surface px-4 py-5" aria-label="Extrato da conta">
      <h2 className="text-title-xl font-bold text-black">Extrato</h2>

      <ul className="mt-3 space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="border-b border-secondary/35 pb-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-body-sm font-semibold text-secondary">{entry.month}</span>
              <span className="text-body-sm text-subtle">{entry.date}</span>
            </div>
            <p className="text-body-md text-heading">{entry.type}</p>
            <p className="text-title-lg font-semibold text-black">
              {formatCurrencyFromCents(entry.amountInCents)}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
