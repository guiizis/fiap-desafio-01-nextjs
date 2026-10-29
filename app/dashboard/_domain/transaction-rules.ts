import { StatementEntryType, TransactionType } from './transaction.types';

export function toStatementEntryType(type: TransactionType): StatementEntryType {
  return type === TransactionType.DEPOSIT
    ? StatementEntryType.DEPOSIT
    : StatementEntryType.TRANSFER;
}

export function normalizeStatementEntryType(type: string): StatementEntryType {
  return type === StatementEntryType.TRANSFER || type === 'Transferencia'
    ? StatementEntryType.TRANSFER
    : StatementEntryType.DEPOSIT;
}

export function toTransactionType(type: StatementEntryType): TransactionType {
  return type === StatementEntryType.TRANSFER ? TransactionType.TRANSFER : TransactionType.DEPOSIT;
}

export function getSignedTransactionAmount(
  type: TransactionType | StatementEntryType,
  amountInCents: number
) {
  const absoluteAmountInCents = Math.abs(amountInCents);
  const isTransfer = type === TransactionType.TRANSFER || type === StatementEntryType.TRANSFER;

  return isTransfer ? -absoluteAmountInCents : absoluteAmountInCents;
}

export function getProjectedBalanceAfterEdit(
  currentBalanceInCents: number,
  currentEntryAmountInCents: number,
  nextType: TransactionType | StatementEntryType,
  nextAmountInCents: number
) {
  return (
    currentBalanceInCents -
    currentEntryAmountInCents +
    getSignedTransactionAmount(nextType, nextAmountInCents)
  );
}

export function hasSufficientBalance(balanceInCents: number, signedAmountInCents: number) {
  return balanceInCents + signedAmountInCents >= 0;
}
