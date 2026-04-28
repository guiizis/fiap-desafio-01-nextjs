import type { NewTransactionResult } from './new-transaction-panel.interfaces';
import { StatementEntryType } from './transaction.interfaces';

export type StatementEntry = {
  id: string;
  month: string;
  type: StatementEntryType;
  amountInCents: number;
  date: string;
};

export type EditStatementEntryPayload = {
  entryId: string;
  type: StatementEntryType;
  amountInCents: number;
  transactionDate: string;
};

export type EditStatementEntryResult = NewTransactionResult;
