export type TransactionType = "deposito" | "transferencia";

export type NewTransactionPayload = {
  type: TransactionType;
  amountInCents: number;
};

export type NewTransactionPanelProps = {
  onSubmitTransaction?: (payload: NewTransactionPayload) => void;
};
