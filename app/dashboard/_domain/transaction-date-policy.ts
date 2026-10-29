import { getCurrentYearInTimeZone, parseIsoDate } from '../_utils/date';

export type TransactionDateRange = {
  minDate: string;
  maxDate: string;
};

export function getTransactionDateRange(
  referenceDate: Date = new Date(),
  timeZone: string = 'America/Sao_Paulo'
): TransactionDateRange {
  const currentYear = getCurrentYearInTimeZone(referenceDate, timeZone);

  return {
    minDate: `${currentYear - 1}-01-01`,
    maxDate: `${currentYear}-12-31`,
  };
}

export function isTransactionDateWithinRange(value: string, range: TransactionDateRange) {
  if (!parseIsoDate(value) || !parseIsoDate(range.minDate) || !parseIsoDate(range.maxDate)) {
    return false;
  }

  return value >= range.minDate && value <= range.maxDate;
}
