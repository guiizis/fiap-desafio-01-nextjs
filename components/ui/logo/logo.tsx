import Image from "next/image";
import type {
  LogoProps,
  LogoSize,
  LogoTone,
  LogoVariant,
} from "./interfaces/logo.interfaces";

const sizeHeights: Record<LogoSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const logoAssets: Record<
  LogoVariant,
  Record<LogoTone, { src: string; width: number; height: number }>
> = {
  full: {
    light: {
      src: "/logo-full.svg",
      width: 300,
      height: 80,
    },
    secondary: {
      src: "/logo-full-secondary.svg",
      width: 300,
      height: 80,
    },
  },
  symbol: {
    light: {
      src: "/logo-symbol.svg",
      width: 48,
      height: 48,
    },
    secondary: {
      src: "/logo-symbol-secondary.svg",
      width: 48,
      height: 48,
    },
  },
};

export function logoAsset(
  variant: LogoVariant = "full",
  tone: LogoTone = "light"
) {
  return logoAssets[variant][tone];
}

export function logoDimensions(
  size: LogoSize = "md",
  variant: LogoVariant = "full",
  tone: LogoTone = "light"
) {
  const asset = logoAsset(variant, tone);
  const height = sizeHeights[size];
  const width = Math.round((asset.width / asset.height) * height);

  return { width, height };
}

export function Logo({
  size = "md",
  variant = "full",
  tone = "light",
  className,
  alt = "McIntosh Bank",
  priority = false,
}: LogoProps) {
  const asset = logoAsset(variant, tone);
  const dimensions = logoDimensions(size, variant, tone);

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={["block", className].filter(Boolean).join(" ")}
    />
  );
}
