import {
  isTransactionDateWithinRange,
  type TransactionDateRange,
} from '../_domain/transaction-date-policy';
import { formatIsoDateToPtBr, parseIsoDate } from './date';

export type TransactionStatementDate = {
  isoDate: string;
  dateLabel: string;
  monthLabel: string;
};

export function toStatementDate(
  value: string,
  range: TransactionDateRange,
  timeZone: string = 'America/Sao_Paulo'
): TransactionStatementDate | null {
  const parsed = parseIsoDate(value);
  if (!parsed || !isTransactionDateWithinRange(value, range)) {
    return null;
  }

  const referenceDate = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12));
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone,
  }).format(referenceDate);

  return {
    isoDate: value,
    dateLabel: formatIsoDateToPtBr(value),
    monthLabel: `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}`,
  };
}
