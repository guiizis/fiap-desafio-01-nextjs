'use client';

import type { ChangeEvent, FocusEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CalendarInputProps,
  CalendarInputRange,
} from './interfaces/calendar-input.interfaces';

const baseInputClasses =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-body placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60';
const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

function getCalendarYear(referenceDate: Date, timeZone: string) {
  const yearLabel = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone,
  }).format(referenceDate);

  return Number(yearLabel);
}

function parseIsoDate(value: string) {
  const matches = isoDateRegex.exec(value);
  if (!matches) {
    return null;
  }

  const [, yearLabel, monthLabel, dayLabel] = matches;
  const year = Number(yearLabel);
  const month = Number(monthLabel);
  const day = Number(dayLabel);

  const date = new Date(Date.UTC(year, month - 1, day));
  const isValidDate =
    date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;

  return isValidDate ? { year, month, day } : null;
}

function formatIsoDateToPtBr(value: string) {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return value;
  }

  const day = String(parsed.day).padStart(2, '0');
  const month = String(parsed.month).padStart(2, '0');

  return `${day}/${month}/${parsed.year}`;
}

function getErrorMessage({
  value,
  required,
  minDate,
  maxDate,
}: {
  value: string;
  required?: boolean;
  minDate: string;
  maxDate: string;
}) {
  if (!value) {
    return required ? 'Campo obrigatório.' : undefined;
  }

  if (!isCalendarDateWithinRange(value, minDate, maxDate)) {
    return `Informe uma data entre ${formatIsoDateToPtBr(minDate)} e ${formatIsoDateToPtBr(maxDate)}.`;
  }

  return undefined;
}

function getCalendarDateRange(
  referenceDate: Date = new Date(),
  timeZone: string = 'America/Sao_Paulo'
): CalendarInputRange {
  const currentYear = getCalendarYear(referenceDate, timeZone);

  return {
    minDate: `${currentYear - 1}-01-01`,
    maxDate: `${currentYear}-12-31`,
  };
}

function isCalendarDateWithinRange(value: string, minDate: string, maxDate: string) {
  if (!parseIsoDate(value)) {
    return false;
  }

  if (!parseIsoDate(minDate) || !parseIsoDate(maxDate)) {
    return false;
  }

  return value >= minDate && value <= maxDate;
}

export function CalendarInput({
  label,
  id,
  name,
  value,
  onChange,
  required,
  containerClassName,
  labelClassName,
  inputClassName,
  errorMessage,
  minDate,
  maxDate,
  onValidityChange,
  onBlur,
  ...props
}: CalendarInputProps) {
  const inputId = id ?? name;
  const [isTouched, setIsTouched] = useState(false);
  const [internalErrorMessage, setInternalErrorMessage] = useState<string | undefined>();
  const defaultRange = useMemo(() => getCalendarDateRange(), []);
  const resolvedMinDate = minDate ?? defaultRange.minDate;
  const resolvedMaxDate = maxDate ?? defaultRange.maxDate;

  const validateValue = useCallback(
    (nextValue: string) =>
      getErrorMessage({
        value: nextValue,
        required,
        minDate: resolvedMinDate,
        maxDate: resolvedMaxDate,
      }),
    [required, resolvedMinDate, resolvedMaxDate]
  );

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    setInternalErrorMessage(validateValue(event.currentTarget.value));
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    if (isTouched || internalErrorMessage) {
      setInternalErrorMessage(validateValue(nextValue));
    }

    onChange(nextValue);
  };

  useEffect(() => {
    const nextError = validateValue(value);
    onValidityChange?.(!nextError);
  }, [value, onValidityChange, validateValue]);

  const currentErrorMessage = errorMessage ?? internalErrorMessage;
  const hasError = Boolean(currentErrorMessage);
  const errorId = hasError ? `${inputId}-error` : undefined;

  return (
    <div className={['space-y-1.5', containerClassName].filter(Boolean).join(' ')}>
      <label
        htmlFor={inputId}
        className={['block text-body-sm font-semibold text-heading', labelClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </label>

      <input
        id={inputId}
        name={name}
        type="date"
        value={value}
        required={required}
        min={resolvedMinDate}
        max={resolvedMaxDate}
        aria-invalid={hasError || undefined}
        aria-describedby={errorId}
        className={[
          baseInputClasses,
          hasError ? 'border-error focus-visible:ring-error' : '',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />

      {hasError ? (
        <p id={errorId} className="text-body-xs text-error">
          {currentErrorMessage}
        </p>
      ) : null}
    </div>
  );
}
