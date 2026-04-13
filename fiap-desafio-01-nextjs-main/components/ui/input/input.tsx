"use client";

import type { ChangeEvent, FocusEvent, InvalidEvent } from "react";
import { useState } from "react";
import type { InputClassOptions, InputProps } from "./interfaces/input.interfaces";
import {
  getInputValidationConstraints,
  resolveInputValidationKind,
  validateInputValue,
} from "./validators/input-validators";

const baseInputClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-body placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

export function inputClasses({ className }: InputClassOptions = {}) {
  return [baseInputClasses, className].filter(Boolean).join(" ");
}

export function Input({
  label,
  id,
  name,
  containerClassName,
  labelClassName,
  inputClassName,
  validationKind,
  hasError,
  errorMessage,
  type = "text",
  required,
  minLength,
  maxLength,
  pattern,
  "aria-describedby": ariaDescribedBy,
  onBlur,
  onChange,
  onInvalid,
  ...props
}: InputProps) {
  const [internalErrorMessage, setInternalErrorMessage] = useState<string | undefined>();
  const [isTouched, setIsTouched] = useState(false);
  const inputId = id ?? name;
  const resolvedValidationKind = resolveInputValidationKind({
    kind: validationKind,
    type,
  });
  const shouldValidate = resolvedValidationKind !== "none";
  const constraints = getInputValidationConstraints(resolvedValidationKind);
  const currentErrorMessage = errorMessage ?? internalErrorMessage;
  const currentHasError = hasError ?? Boolean(currentErrorMessage);
  const errorId = currentErrorMessage ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  const validate = (value: string) => {
    if (!shouldValidate || errorMessage !== undefined || hasError !== undefined) {
      return;
    }

    const nextError = validateInputValue(resolvedValidationKind, value);
    setInternalErrorMessage(nextError ?? undefined);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    validate(event.currentTarget.value);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    if (internalErrorMessage) {
      validate(event.currentTarget.value);
    }
    onChange?.(event);
  };

  const handleInvalid = (event: InvalidEvent<HTMLInputElement>) => {
    if (isTouched) {
      validate(event.currentTarget.value);
    }
    onInvalid?.(event);
  };

  return (
    <div className={["space-y-1.5", containerClassName].filter(Boolean).join(" ")}>
      <label
        htmlFor={inputId}
        className={["block text-body-sm font-semibold text-heading", labelClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        required={required ?? constraints.required}
        minLength={minLength ?? constraints.minLength}
        maxLength={maxLength ?? constraints.maxLength}
        pattern={pattern ?? constraints.pattern}
        aria-invalid={currentHasError || undefined}
        aria-describedby={describedBy}
        onBlur={handleBlur}
        onChange={handleChange}
        onInvalid={handleInvalid}
        className={inputClasses({
          className: [
            currentHasError ? "border-error focus-visible:ring-error" : undefined,
            inputClassName,
          ]
            .filter(Boolean)
            .join(" "),
        })}
        {...props}
      />
      {currentErrorMessage ? (
        <p id={errorId} className="text-body-xs text-error">
          {currentErrorMessage}
        </p>
      ) : null}
    </div>
  );
}
