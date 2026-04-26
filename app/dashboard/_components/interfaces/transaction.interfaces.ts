export enum TransactionType {
  DEPOSITO = "deposito",
  TRANSFERENCIA = "transferencia",
}

export enum StatementEntryType {
  DEPOSITO = "Deposito",
  TRANSFERENCIA = "Transferencia",
}

export function toStatementEntryType(type: TransactionType): StatementEntryType {
  return type === TransactionType.DEPOSITO
    ? StatementEntryType.DEPOSITO
    : StatementEntryType.TRANSFERENCIA;
}

export function normalizeStatementEntryType(type: string): StatementEntryType {
  return type === StatementEntryType.TRANSFERENCIA
    ? StatementEntryType.TRANSFERENCIA
    : StatementEntryType.DEPOSITO;
}

export function toTransactionType(type: StatementEntryType): TransactionType {
  return type === StatementEntryType.TRANSFERENCIA
    ? TransactionType.TRANSFERENCIA
    : TransactionType.DEPOSITO;
}

export function formatStatementEntryTypeLabel(type: StatementEntryType) {
  return type === StatementEntryType.DEPOSITO ? "Depósito" : "Transferência";
}
