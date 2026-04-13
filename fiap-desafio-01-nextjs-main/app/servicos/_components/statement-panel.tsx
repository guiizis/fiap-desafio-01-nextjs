import { useState } from 'react';
import type { StatementEntry } from './interfaces/statement-panel.interfaces';
import { formatCurrencyFromCents } from '../../lib/calc';

type StatementPanelProps = {
  entries: readonly StatementEntry[];
};

export function StatementPanel({ entries }: StatementPanelProps) {
  const [localEntries, setLocalEntries] = useState(entries);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      setLocalEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <aside className="rounded-md bg-surface px-4 py-5" aria-label="Extrato da conta">
      <h2 className="text-title-xl font-bold text-black">Extrato</h2>

      <ul className="mt-3 space-y-3">
        {localEntries.map((entry) => (
          <li
  key={entry.id}
  className="group relative border-b border-secondary/35 pb-2 flex flex-col gap-2"
>
  {/* Bloco de informações */}
  <div className="flex items-center justify-between">
    <span className="text-body-sm font-semibold text-secondary">{entry.month}</span>
    <span className="text-body-sm text-subtle">{entry.date}</span>
  </div>
  <p className="text-body-md text-heading">{entry.type}</p>

  {/* Valor */}
  <p
    className={`text-title-lg font-semibold ${
      entry.amountInCents < 0 ? 'text-red-600' : 'text-green-600'
    }`}
  >
    {formatCurrencyFromCents(entry.amountInCents)}
  </p>

  {/* Botão para mobile/tablet */}
  <button
    onClick={() => handleDelete(entry.id)}
    className="
      flex md:hidden
      items-center justify-center
      h-8 w-full rounded-md bg-red-500 text-white text-sm font-bold
      hover:bg-red-600 transition-colors
    "
    aria-label="Excluir transação"
  >
    Deletar
  </button>

  {/* Botão circular para desktop, abaixo do valor */}
  <button
    onClick={() => handleDelete(entry.id)}
    className="
      hidden md:flex
      items-center justify-center
      h-8 w-8 rounded-full border-2 border-red-500 text-red-500
      text-lg font-bold cursor-pointer
      hover:bg-red-500 hover:text-white transition-transform transform hover:scale-110
      self-start
    "
    aria-label="Excluir transação"
  >
    ×
  </button>
</li>


        ))}
      </ul>
    </aside>
  );
}
