"use client";

import type { FormEventHandler } from "react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input, Select } from "../../../components/ui/input";
import type {
  NewTransactionPanelProps,
  TransactionType,
} from "./interfaces/new-transaction-panel.interfaces";
import { formatCurrencyInput } from "../_utils/currency-mask";

function parseCurrencyInputToCents(value: string) {
  const normalizedAmount = value.replace(/\./g, "").replace(",", ".");
  const amountValue = Number(normalizedAmount);

  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    return 0;
  }

  return Math.round(amountValue * 100);
}

export function NewTransactionPanel({ onSubmitTransaction }: NewTransactionPanelProps) {
  const [transactionType, setTransactionType] = useState<TransactionType | "">("");
  const [transactionAmount, setTransactionAmount] = useState("00,00");
  const transactionOptions: readonly { value: TransactionType; label: string }[] = [
    { value: "deposito", label: "Depósito" },
    { value: "transferencia", label: "Transferência" },
  ];

  const amountInCents = useMemo(() => parseCurrencyInputToCents(transactionAmount), [transactionAmount]);
  const isAmountValid = amountInCents > 0;

  const isFormValid = transactionType !== "" && isAmountValid;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (transactionType !== "deposito" && transactionType !== "transferencia") {
      return;
    }

    if (!isAmountValid) {
      return;
    }

    onSubmitTransaction?.({
      type: transactionType,
      amountInCents,
    });

    setTransactionType("");
    setTransactionAmount("00,00");
  };

  return (
    <section
      className="relative min-h-[560px] overflow-hidden rounded-md bg-surface-transaction p-8"
      aria-label={"Nova transação"}
    >
      <Image
        src="/servicos/transacoes/square-top.svg"
        alt=""
        width={178}
        height={180}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0"
      />
      <Image
        src="/servicos/transacoes/square-bottom.svg"
        alt=""
        width={178}
        height={180}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0"
      />

      <div className="relative z-10 max-w-[420px]">
        <h2 className="text-[3rem] font-bold leading-none text-transaction-text">
          {"Nova transação"}
        </h2>

        <form className="mt-10" onSubmit={handleSubmit} noValidate>
          <Select
            label={"Tipo de transação"}
            id="transaction-type"
            name="transaction-type"
            options={transactionOptions}
            placeholder={"Selecione o tipo de transação"}
            value={transactionType}
            onChange={(event) => {
              const value = event.currentTarget.value;

              if (value === "deposito" || value === "transferencia" || value === "") {
                setTransactionType(value);
              }
            }}
            required
            containerClassName=""
            labelClassName="sr-only"
            selectClassName="h-14 border-primary bg-surface px-5 pr-12 text-title-lg text-body focus-visible:ring-primary"
          />

          <Input
            label="Valor"
            id="transaction-amount"
            name="transaction-amount"
            type="text"
            inputMode="numeric"
            value={transactionAmount}
            onChange={(event) => setTransactionAmount(formatCurrencyInput(event.currentTarget.value))}
            required
            containerClassName="mt-10 max-w-[296px]"
            labelClassName="mb-3 text-title-xl font-bold text-transaction-text"
            inputClassName="h-14 border-primary bg-surface text-center text-title-lg text-body focus-visible:ring-primary"
            validationKind="none"
          />

          <div className={["mt-10 w-fit", !isFormValid ? "cursor-not-allowed" : ""].join(" ")}>
            <Button
              type="submit"
              variant="solid"
              tone="primary"
              className={[
                "h-14 w-[296px] text-title-xl font-bold",
                !isFormValid ? "pointer-events-none" : "",
              ].join(" ")}
              disabled={!isFormValid}
            >
              {"Concluir transação"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
