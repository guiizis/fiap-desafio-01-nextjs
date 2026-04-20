export type TransactionType = "deposito" | "transferencia";

export type NewTransactionPayload = {
  type: TransactionType;
  amountInCents: number;
};

export type NewTransactionResult =
  | { ok: true }
  | { ok: false; message: string };

export type NewTransactionPanelProps = {
  onSubmitTransaction?: (payload: NewTransactionPayload) => NewTransactionResult | void;
};
