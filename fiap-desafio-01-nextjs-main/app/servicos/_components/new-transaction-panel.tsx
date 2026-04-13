'use client';

import type { FormEventHandler } from 'react';
import { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input, Select } from '../../../components/ui/input';
import { formatCurrencyInput } from '../_utils/currency-mask';

export function NewTransactionPanel() {
  const [transactionType, setTransactionType] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('00,00');
  const transactionOptions = [
    { value: 'deposito', label: 'Depósito' },
    { value: 'transferencia', label: 'Transferência' },
  ] as const;

  const isAmountValid = useMemo(() => {
    const normalizedAmount = transactionAmount.replace(/\./g, '').replace(',', '.');
    const amountValue = Number(normalizedAmount);

    return Number.isFinite(amountValue) && amountValue > 0;
  }, [transactionAmount]);

  const isFormValid = transactionType !== '' && isAmountValid;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  return (
    <section
      className="relative min-h-[560px] overflow-hidden rounded-md bg-surface-transaction p-6 sm:p-8"
      aria-label="Nova transação"
    >
      <div className="relative z-10 max-w-full sm:max-w-[420px]">
        <h2 className="text-2xl sm:text-[3rem] font-bold leading-none text-black text-outline">
          Nova Transação
        </h2>

        <form className="mt-6 sm:mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
          <Select
            label="Tipo de transação"
            id="transaction-type"
            name="transaction-type"
            options={transactionOptions}
            placeholder="Selecione o tipo de transação"
            value={transactionType}
            onChange={(event) => setTransactionType(event.currentTarget.value)}
            required
            containerClassName="w-full"
            labelClassName="sr-only"
            selectClassName="h-12 sm:h-14 border-primary bg-surface px-4 sm:px-5 pr-10 sm:pr-12 text-base sm:text-title-lg text-body focus-visible:ring-primary"
          />

          <Input
            label="Valor"
            id="transaction-amount"
            name="transaction-amount"
            type="text"
            inputMode="numeric"
            value={transactionAmount}
            onChange={(event) =>
              setTransactionAmount(formatCurrencyInput(event.currentTarget.value))
            }
            required
            containerClassName="w-full sm:max-w-[296px]"
            labelClassName="mb-2 sm:mb-3 text-lg sm:text-title-xl font-bold text-black text-outline"
            inputClassName="h-12 sm:h-14 border-primary bg-surface text-center text-base sm:text-title-lg text-body focus-visible:ring-primary"
            validationKind="none"
          />

          <div className={['w-full sm:w-fit', !isFormValid ? 'cursor-not-allowed' : ''].join(' ')}>
            <Button
              type="submit"
              variant="solid"
              tone="primary"
              className={[
                'h-12 sm:h-14 w-full sm:w-[296px] text-lg sm:text-title-xl font-bold',
                !isFormValid ? 'pointer-events-none' : '',
              ].join(' ')}
              disabled={!isFormValid}
            >
              Concluir transação
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
