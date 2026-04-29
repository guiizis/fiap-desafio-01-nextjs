export enum TransactionType {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
}

export enum StatementEntryType {
  DEPOSIT = "Deposit",
  TRANSFER = "Transfer",
}

export function toStatementEntryType(type: TransactionType): StatementEntryType {
  return type === TransactionType.DEPOSIT
    ? StatementEntryType.DEPOSIT
    : StatementEntryType.TRANSFER;
}

export function normalizeStatementEntryType(type: string): StatementEntryType {
  return type === StatementEntryType.TRANSFER || type === "Transferencia"
    ? StatementEntryType.TRANSFER
    : StatementEntryType.DEPOSIT;
}

export function toTransactionType(type: StatementEntryType): TransactionType {
  return type === StatementEntryType.TRANSFER
    ? TransactionType.TRANSFER
    : TransactionType.DEPOSIT;
}

export function formatStatementEntryTypeLabel(type: StatementEntryType) {
  return type === StatementEntryType.DEPOSIT ? "Depósito" : "Transferência";
}
