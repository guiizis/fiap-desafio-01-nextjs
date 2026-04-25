export type LogoSize = "sm" | "md" | "lg";
export type LogoVariant = "full" | "symbol";
export type LogoTone = "light" | "secondary";

export type LogoProps = {
  size?: LogoSize;
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  alt?: string;
  priority?: boolean;
};
