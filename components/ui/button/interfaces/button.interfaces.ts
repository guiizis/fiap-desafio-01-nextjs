import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonTone = "primary" | "secondary" | "accent" | "error";

export type ButtonVariantOptions = {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  className?: string;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
};
