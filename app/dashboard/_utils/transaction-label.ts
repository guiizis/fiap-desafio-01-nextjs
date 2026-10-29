import { StatementEntryType } from '../_domain/transaction.types';

export function formatStatementEntryTypeLabel(type: StatementEntryType) {
  return type === StatementEntryType.DEPOSIT ? 'Depósito' : 'Transferência';
}
