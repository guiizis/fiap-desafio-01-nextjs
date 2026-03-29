import type {
  ButtonProps,
  ButtonTone,
  ButtonVariant,
  ButtonVariantOptions,
} from "./interfaces/button.interfaces";

const baseClasses =
  "inline-flex items-center justify-center rounded-md border px-4 py-2 text-body-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const toneFocusClasses: Record<ButtonTone, string> = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-secondary",
  accent: "focus-visible:ring-accent",
  error: "focus-visible:ring-error",
};

const variantToneClasses: Record<ButtonVariant, Record<ButtonTone, string>> = {
  solid: {
    primary: "border-primary bg-primary text-surface hover:bg-primary-hover",
    secondary:
      "border-secondary bg-secondary text-surface hover:bg-secondary-hover",
    accent: "border-accent bg-accent text-surface hover:bg-accent-hover",
    error: "border-error bg-error text-surface hover:opacity-90",
  },
  outline: {
    primary: "border-primary bg-transparent text-primary hover:bg-primary/10",
    secondary: "border-secondary bg-transparent text-secondary hover:bg-secondary/10",
    accent: "border-accent bg-transparent text-accent hover:bg-accent/10",
    error: "border-error bg-transparent text-error hover:bg-error/10",
  },
  ghost: {
    primary: "border-transparent bg-transparent text-primary hover:bg-primary/10",
    secondary:
      "border-transparent bg-transparent text-secondary hover:bg-secondary/10",
    accent: "border-transparent bg-transparent text-accent hover:bg-accent/10",
    error: "border-transparent bg-transparent text-error hover:bg-error/10",
  },
};

export function buttonVariants({
  variant = "solid",
  tone = "primary",
  className,
}: ButtonVariantOptions = {}) {
  return [baseClasses, toneFocusClasses[tone], variantToneClasses[variant][tone], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "solid",
  tone = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, tone, className })}
      {...props}
    />
  );
}
