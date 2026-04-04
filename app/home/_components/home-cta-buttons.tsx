import Link from "next/link";
import { buttonVariants } from "../../../components/ui/button";

type HomeCtaContext = "header" | "hero-mobile";

type HomeCtaButtonsProps = {
  context: HomeCtaContext;
};

const ctaByContext: Record<
  HomeCtaContext,
  {
    containerClassName: string;
    primaryLabel: string;
    primaryClassName: string;
    secondaryLabel: string;
    secondaryClassName: string;
    tone: "primary" | "secondary";
  }
> = {
  header: {
    containerClassName: "flex items-center gap-3",
    primaryLabel: "Abrir minha conta",
    primaryClassName: "px-6",
    secondaryLabel: "Já tenho conta",
    secondaryClassName: "px-6",
    tone: "secondary",
  },
  "hero-mobile": {
    containerClassName: "flex w-full items-center gap-4",
    primaryLabel: "Abrir conta",
    primaryClassName:
      "h-12 flex-1 justify-center border-black bg-black text-surface hover:bg-black/90 focus-visible:ring-black",
    secondaryLabel: "Já tenho conta",
    secondaryClassName:
      "h-12 flex-1 justify-center border-black text-black hover:bg-black/5 focus-visible:ring-black",
    tone: "primary",
  },
};

export function HomeCtaButtons({ context }: HomeCtaButtonsProps) {
  const config = ctaByContext[context];

  return (
    <div className={config.containerClassName}>
      <Link
        href="/abrir-conta"
        className={buttonVariants({
          variant: "solid",
          tone: config.tone,
          className: config.primaryClassName,
        })}
      >
        {config.primaryLabel}
      </Link>
      <Link
        href="/login"
        className={buttonVariants({
          variant: "outline",
          tone: config.tone,
          className: config.secondaryClassName,
        })}
      >
        {config.secondaryLabel}
      </Link>
    </div>
  );
}
