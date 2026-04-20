"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { StatementEntry } from "./interfaces/statement-panel.interfaces";
import { formatCurrencyFromCents } from "../../lib/calc";
import { formatCurrencyInput } from "../_utils/currency-mask";

type StatementPanelProps = {
  entries: readonly StatementEntry[];
  onDeleteEntry?: (entryId: string) => void;
  onEditEntry?: (entryId: string, amountInCents: number) => void;
};

function formatCentsToInputValue(amountInCents: number) {
  const absoluteAmount = Math.abs(amountInCents);
  const integerPart = Math.floor(absoluteAmount / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalPart = (absoluteAmount % 100).toString().padStart(2, "0");
  return `${integerPart},${decimalPart}`;
}

function parseInputValueToCents(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const amountValue = Number(normalized);

  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    return null;
  }

  return Math.round(amountValue * 100);
}

export function StatementPanel({ entries, onDeleteEntry, onEditEntry }: StatementPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("00,00");

  const activeSelectedEntryId = entries.some((entry) => entry.id === selectedEntryId)
    ? selectedEntryId
    : null;
  const hasSelectedEntry = activeSelectedEntryId !== null;

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      setSelectedEntryId(null);
      setEditingEntryId(null);
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, []);

  const handleDeleteSelectedEntry = () => {
    if (!activeSelectedEntryId) {
      return;
    }

    onDeleteEntry?.(activeSelectedEntryId);

    if (editingEntryId === activeSelectedEntryId) {
      setEditingEntryId(null);
    }
  };

  const handleEditSelectedEntry = () => {
    if (!activeSelectedEntryId) {
      return;
    }

    const selectedEntry = entries.find((entry) => entry.id === activeSelectedEntryId);
    if (!selectedEntry) {
      return;
    }

    setEditingEntryId(activeSelectedEntryId);
    setEditingAmount(formatCentsToInputValue(selectedEntry.amountInCents));
  };

  const handleSubmitEditingEntry = () => {
    if (!editingEntryId) {
      return;
    }

    const parsedAmountInCents = parseInputValueToCents(editingAmount);
    if (parsedAmountInCents === null) {
      return;
    }

    onEditEntry?.(editingEntryId, parsedAmountInCents);
    setEditingEntryId(null);
  };

  return (
    <aside ref={panelRef} className="rounded-md bg-surface px-5 py-5" aria-label="Extrato da conta">
      <div className="flex items-center justify-between gap-3 pr-1">
        <h2 className="text-title-xl font-bold text-black">Extrato</h2>
        <div className="flex items-center gap-3">
          <Button
            aria-label="Editar extrato"
            variant="solid"
            tone="primary"
            className="h-12 w-12 !rounded-full p-0"
            disabled={!hasSelectedEntry}
            onClick={handleEditSelectedEntry}
          >
            <Image src="/icons/pencil-edit.svg" alt="" width={24} height={24} aria-hidden="true" />
          </Button>
          <Button
            aria-label="Excluir extrato"
            variant="solid"
            tone="primary"
            className="h-12 w-12 !rounded-full p-0"
            disabled={!hasSelectedEntry}
            onClick={handleDeleteSelectedEntry}
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
              activeSelectedEntryId === entry.id ? "bg-surface-soft" : "",
            ].join(" ")}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-body-sm font-semibold text-secondary">{entry.month}</span>
              <span className="text-body-sm text-subtle">{entry.date}</span>
            </div>
            <p className="text-body-md text-heading">{entry.type}</p>
            {editingEntryId === entry.id ? (
              <Input
                label="Valor do lancamento"
                id={`statement-entry-${entry.id}-amount`}
                name={`statement-entry-${entry.id}-amount`}
                type="text"
                inputMode="numeric"
                value={editingAmount}
                onChange={(event) => setEditingAmount(formatCurrencyInput(event.currentTarget.value))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmitEditingEntry();
                  }

                  if (event.key === "Escape") {
                    event.preventDefault();
                    setEditingEntryId(null);
                  }
                }}
                onBlur={handleSubmitEditingEntry}
                validationKind="none"
                containerClassName="mt-1 max-w-[180px]"
                labelClassName="sr-only"
                inputClassName="h-10 text-title-lg font-semibold text-black"
              />
            ) : (
              <p className="text-title-lg font-semibold text-black">
                {formatCurrencyFromCents(entry.amountInCents)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
