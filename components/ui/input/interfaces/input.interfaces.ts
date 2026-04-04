import type { InputHTMLAttributes } from "react";

export type InputClassOptions = {
  className?: string;
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};
