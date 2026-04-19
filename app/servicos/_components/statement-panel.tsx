"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import type { StatementEntry } from "./interfaces/statement-panel.interfaces";
import { formatCurrencyFromCents } from "../../lib/calc";

type StatementPanelProps = {
  entries: readonly StatementEntry[];
};

export function StatementPanel({ entries }: StatementPanelProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const hasSelectedEntry = selectedEntryId !== null;

  return (
    <aside className="rounded-md bg-surface px-5 py-5" aria-label="Extrato da conta">
      <div className="flex items-center justify-between gap-3 pr-1">
        <h2 className="text-title-xl font-bold text-black">Extrato</h2>
        <div className="flex items-center gap-3">
          <Button
            aria-label="Editar extrato"
            variant="solid"
            tone="primary"
            className="h-12 w-12 !rounded-full p-0"
            disabled={!hasSelectedEntry}
          >
            <Image src="/icons/pencil-edit.svg" alt="" width={24} height={24} aria-hidden="true" />
          </Button>
          <Button
            aria-label="Excluir extrato"
            variant="solid"
            tone="primary"
            className="h-12 w-12 !rounded-full p-0"
            disabled={!hasSelectedEntry}
          >
            <Image src="/icons/trash-exclude.svg" alt="" width={24} height={24} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <ul className="mt-3 space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            onClick={() => setSelectedEntryId(entry.id)}
            className={[
              "cursor-pointer border-b border-secondary/35 pb-2 transition-colors",
              selectedEntryId === entry.id ? "bg-surface-muted/60" : "",
            ].join(" ")}
          >
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
