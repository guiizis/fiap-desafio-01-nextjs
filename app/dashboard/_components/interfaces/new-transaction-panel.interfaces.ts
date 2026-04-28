import { StatementEntryType } from './transaction.interfaces';

export type NewTransactionPayload = {
  type: StatementEntryType;
  amountInCents: number;
  transactionDate: string;
};

export type NewTransactionResult = { ok: true } | { ok: false; message: string };

export type NewTransactionPanelProps = {
  onSubmitTransaction?: (payload: NewTransactionPayload) => NewTransactionResult | void;
};
