import type { InputHTMLAttributes } from "react";

export type CalendarInputRange = {
  minDate: string;
  maxDate: string;
};

export type CalendarInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "value" | "onChange"
> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessage?: string;
  minDate?: string;
  maxDate?: string;
  onValidityChange?: (isValid: boolean) => void;
};

