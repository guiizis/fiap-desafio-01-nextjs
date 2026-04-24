import type { NewTransactionResult } from "./new-transaction-panel.interfaces";
import {
  StatementEntryType,
  TransactionType,
  formatStatementEntryTypeLabel,
  normalizeStatementEntryType,
  toStatementEntryType,
  toTransactionType,
} from "./transaction.interfaces";

export {
  StatementEntryType,
  TransactionType,
  formatStatementEntryTypeLabel,
  normalizeStatementEntryType,
  toStatementEntryType,
  toTransactionType,
};

export type StatementEntry = {
  id: string;
  month: string;
  type: StatementEntryType;
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
