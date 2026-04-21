import type { NewTransactionResult, TransactionType } from "./new-transaction-panel.interfaces";

export type StatementEntry = {
  id: string;
  month: string;
  type: string;
  amountInCents: number;
  date: string;
};

export type EditStatementEntryPayload = {
  entryId: string;
  type: TransactionType;
  amountInCents: number;
  transactionDate: string;
};

export type EditStatementEntryResult = NewTransactionResult;
