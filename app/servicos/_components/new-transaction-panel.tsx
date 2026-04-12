"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input, Select } from "../../../components/ui/input";
import { formatCurrencyInput } from "../_utils/currency-mask";

export function NewTransactionPanel() {
  const [transactionAmount, setTransactionAmount] = useState("00,00");
  const transactionOptions = [
    { value: "deposito", label: "Dep\u00f3sito" },
    { value: "transferencia", label: "Transfer\u00eancia" },
  ] as const;

  return (
    <section
      className="relative min-h-[560px] overflow-hidden rounded-md bg-surface-transaction p-8"
      aria-label={"Nova transa\u00e7\u00e3o"}
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
          {"Nova transa\u00e7\u00e3o"}
        </h2>

        <Select
          label={"Tipo de transa\u00e7\u00e3o"}
          id="transaction-type"
          name="transaction-type"
          options={transactionOptions}
          placeholder={"Selecione o tipo de transa\u00e7\u00e3o"}
          defaultValue=""
          containerClassName="mt-10"
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
          containerClassName="mt-10 max-w-[296px]"
          labelClassName="mb-3 text-title-xl font-bold text-transaction-text"
          inputClassName="h-14 border-primary bg-surface text-center text-title-lg text-body focus-visible:ring-primary"
          validationKind="none"
        />

        <Button
          type="button"
          variant="solid"
          tone="primary"
          className="mt-10 h-14 w-[296px] text-title-xl font-bold"
        >
          {"Concluir transa\u00e7\u00e3o"}
        </Button>
      </div>
    </section>
  );
}
