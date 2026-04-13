import type { SelectClassOptions, SelectProps } from "./interfaces/select.interfaces";

const baseSelectClasses =
  "w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

export function selectClasses({ className }: SelectClassOptions = {}) {
  return [baseSelectClasses, className].filter(Boolean).join(" ");
}

export function Select({
  label,
  id,
  name,
  options,
  placeholder,
  containerClassName,
  labelClassName,
  selectClassName,
  hasError,
  errorMessage,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  const selectId = id ?? name;
  const currentHasError = hasError ?? Boolean(errorMessage);
  const errorId = errorMessage ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["space-y-1.5", containerClassName].filter(Boolean).join(" ")}>
      <label
        htmlFor={selectId}
        className={["block text-body-sm font-semibold text-heading", labelClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          name={name}
          aria-invalid={currentHasError || undefined}
          aria-describedby={describedBy}
          className={selectClasses({
            className: [
              currentHasError ? "border-error focus-visible:ring-error" : undefined,
              selectClassName,
            ]
              .filter(Boolean)
              .join(" "),
          })}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-0 w-0 -translate-y-1/2 border-l-[8px] border-r-[8px] border-t-[9px] border-l-transparent border-r-transparent border-t-primary"
        />
      </div>

      {errorMessage ? (
        <p id={errorId} className="text-body-xs text-error">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
