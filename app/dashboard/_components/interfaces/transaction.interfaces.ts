export enum StatementEntryType {
  DEPOSIT = 'Deposit',
  TRANSFER = 'Transfer',
}

export function toStatementEntryType(type: StatementEntryType): StatementEntryType {
  return type === StatementEntryType.DEPOSIT
    ? StatementEntryType.DEPOSIT
    : StatementEntryType.TRANSFER;
}

export function normalizeStatementEntryType(type: string): StatementEntryType {
  return type === StatementEntryType.TRANSFER || type === 'Transferencia'
    ? StatementEntryType.TRANSFER
    : StatementEntryType.DEPOSIT;
}

export function formatStatementEntryTypeLabel(type: StatementEntryType) {
  return type === StatementEntryType.DEPOSIT ? 'Depósito' : 'Transferência';
}
