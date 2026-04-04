import type { InputClassOptions, InputProps } from "./interfaces/input.interfaces";

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
  ...props
}: InputProps) {
  const inputId = id ?? name;

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
      <input id={inputId} name={name} className={inputClasses({ className: inputClassName })} {...props} />
    </div>
  );
}
