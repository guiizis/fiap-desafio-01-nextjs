"use client";

import type { FormEventHandler } from "react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input, Select } from "../../../components/ui/input";
import { formatCurrencyInput } from "../_utils/currency-mask";

export function NewTransactionPanel() {
  const [transactionType, setTransactionType] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("00,00");
  const transactionOptions = [
    { value: "deposito", label: "Dep\u00f3sito" },
    { value: "transferencia", label: "Transfer\u00eancia" },
  ] as const;

  const isAmountValid = useMemo(() => {
    const normalizedAmount = transactionAmount.replace(/\./g, "").replace(",", ".");
    const amountValue = Number(normalizedAmount);

    return Number.isFinite(amountValue) && amountValue > 0;
  }, [transactionAmount]);

  const isFormValid = transactionType !== "" && isAmountValid;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

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

        <form className="mt-10" onSubmit={handleSubmit} noValidate>
          <Select
            label={"Tipo de transa\u00e7\u00e3o"}
            id="transaction-type"
            name="transaction-type"
            options={transactionOptions}
            placeholder={"Selecione o tipo de transa\u00e7\u00e3o"}
            value={transactionType}
            onChange={(event) => setTransactionType(event.currentTarget.value)}
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
              {"Concluir transa\u00e7\u00e3o"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
