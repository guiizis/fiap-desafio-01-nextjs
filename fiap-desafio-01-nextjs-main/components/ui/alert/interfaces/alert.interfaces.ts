import type { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "info" | "warning" | "error" | "success";

export type AlertClassOptions = {
  variant?: AlertVariant;
  className?: string;
};

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
  variant?: AlertVariant;
  tone?: AlertVariant;
  icon?: ReactNode;
  onClose?: () => void;
  dismissAfterMs?: number;
  autoDismissMs?: number;
};
