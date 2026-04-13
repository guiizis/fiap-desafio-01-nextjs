import type { InputHTMLAttributes } from "react";
import type { InputValidationKind } from "../validators/input-validators";

export type InputClassOptions = {
  className?: string;
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  validationKind?: InputValidationKind;
  hasError?: boolean;
  errorMessage?: string;
};
