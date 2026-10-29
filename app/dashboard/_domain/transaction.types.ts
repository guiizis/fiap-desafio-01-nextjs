export enum TransactionType {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}

export enum StatementEntryType {
  DEPOSIT = 'Deposit',
  TRANSFER = 'Transfer',
}

export type StatementEntry = {
  id: string;
  month: string;
  type: StatementEntryType;
  amountInCents: number;
  date: string;
};

export type NewTransactionPayload = {
  type: TransactionType;
  amountInCents: number;
  transactionDate: string;
};

export type EditStatementEntryPayload = NewTransactionPayload & {
  entryId: string;
};

export type TransactionResult = { ok: true } | { ok: false; message: string };
