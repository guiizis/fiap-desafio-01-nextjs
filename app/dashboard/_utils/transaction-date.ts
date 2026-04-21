export const TRANSACTION_DATE_TIME_ZONE = "America/Sao_Paulo";

const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

export type TransactionDateRange = {
  minDate: string;
  maxDate: string;
};

export type TransactionStatementDate = {
  isoDate: string;
  dateLabel: string;
  monthLabel: string;
};

function parseIsoDate(value: string) {
  const matches = isoDateRegex.exec(value);
  if (!matches) {
    return null;
  }

  const [, yearLabel, monthLabel, dayLabel] = matches;
  const year = Number(yearLabel);
  const month = Number(monthLabel);
  const day = Number(dayLabel);

  const date = new Date(Date.UTC(year, month - 1, day, 12));
  const isValidDate = date.getUTCFullYear() === year
    && date.getUTCMonth() + 1 === month
    && date.getUTCDate() === day;

  return isValidDate ? { year, month, day } : null;
}

export function formatIsoDateToPtBr(value: string) {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return value;
  }

  const day = String(parsed.day).padStart(2, "0");
  const month = String(parsed.month).padStart(2, "0");

  return `${day}/${month}/${parsed.year}`;
}

export function getTransactionDateRange(
  referenceDate: Date = new Date(),
  timeZone: string = TRANSACTION_DATE_TIME_ZONE
): TransactionDateRange {
  const yearLabel = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone,
  }).format(referenceDate);
  const currentYear = Number(yearLabel);

  return {
    minDate: `${currentYear - 1}-01-01`,
    maxDate: `${currentYear}-12-31`,
  };
}

export function getDefaultTransactionDate(
  referenceDate: Date = new Date(),
  timeZone: string = TRANSACTION_DATE_TIME_ZONE
) {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).formatToParts(referenceDate);

  const year = dateParts.find((part) => part.type === "year")?.value ?? "1970";
  const month = dateParts.find((part) => part.type === "month")?.value ?? "01";
  const day = dateParts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function isTransactionDateWithinRange(value: string, range: TransactionDateRange) {
  if (!parseIsoDate(value) || !parseIsoDate(range.minDate) || !parseIsoDate(range.maxDate)) {
    return false;
  }

  return value >= range.minDate && value <= range.maxDate;
}

export function toStatementDate(
  value: string,
  range: TransactionDateRange,
  timeZone: string = TRANSACTION_DATE_TIME_ZONE
): TransactionStatementDate | null {
  const parsed = parseIsoDate(value);
  if (!parsed || !isTransactionDateWithinRange(value, range)) {
    return null;
  }

  const referenceDate = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12));
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone,
  }).format(referenceDate);

  return {
    isoDate: value,
    dateLabel: formatIsoDateToPtBr(value),
    monthLabel: `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}`,
  };
}
