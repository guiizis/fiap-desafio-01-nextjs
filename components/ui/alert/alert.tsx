import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { AlertClassOptions, AlertProps, AlertVariant } from "./interfaces/alert.interfaces";

const baseClasses =
  "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-body-sm font-semibold shadow-sm";

const variantClasses: Record<AlertVariant, string> = {
  info: "border-primary/25 bg-primary/10 text-primary",
  warning: "border-accent/25 bg-accent/10 text-accent",
  error: "border-error/25 bg-error/10 text-error",
  success: "border-success/35 bg-success/20 text-success",
};

const closeButtonVariantClasses: Record<AlertVariant, string> = {
  info: "hover:bg-primary/20 focus-visible:ring-primary",
  warning: "hover:bg-accent/20 focus-visible:ring-accent",
  error: "hover:bg-error/20 focus-visible:ring-error",
  success: "hover:bg-success/20 focus-visible:ring-success",
};

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none">
      <path
        d="M12 3L2.5 20h19L12 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 12.5l2.7 2.7L16 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconByVariant: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
  success: <SuccessIcon />,
};

export function alertClasses({ variant = "info", className }: AlertClassOptions = {}) {
  return [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");
}

export function Alert({
  message,
  variant,
  tone,
  icon,
  onClose,
  dismissAfterMs,
  autoDismissMs,
  className,
  style,
  ...props
}: AlertProps) {
  const resolvedVariant = variant ?? tone ?? "info";
  const resolvedDismissMs = dismissAfterMs ?? autoDismissMs;
  const shouldAutoDismiss =
    typeof onClose === "function" &&
    typeof resolvedDismissMs === "number" &&
    resolvedDismissMs > 0;

  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!shouldAutoDismiss) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onCloseRef.current?.();
    }, resolvedDismissMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message, resolvedDismissMs, resolvedVariant, shouldAutoDismiss]);

  return (
    <div
      role={resolvedVariant === "error" ? "alert" : "status"}
      aria-live={resolvedVariant === "error" ? "assertive" : "polite"}
      className={alertClasses({
        variant: resolvedVariant,
        className,
      })}
      style={style}
      {...props}
    >
      {icon ?? iconByVariant[resolvedVariant]}
      <p className="min-w-0 flex-1 leading-5">{message}</p>
      {onClose ? (
        <button
          type="button"
          aria-label="Fechar alerta"
          onClick={onClose}
          className={[
            "inline-flex h-6 w-6 flex-none items-center justify-center rounded-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2",
            closeButtonVariantClasses[resolvedVariant],
          ].join(" ")}
        >
          x
        </button>
      ) : null}
    </div>
  );
}
