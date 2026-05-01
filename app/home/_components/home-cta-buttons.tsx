'use client';

import Link from 'next/link';
import { useAuthSession } from '@/app/dashboard/_hooks/use-auth-session';
import { buttonVariants } from '@/components/ui/button';

type HomeCtaContext = 'header' | 'hero-mobile';

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
    tone: 'primary' | 'secondary';
  }
> = {
  header: {
    containerClassName: 'flex items-center gap-3',
    primaryLabel: 'Abrir minha conta',
    primaryClassName: 'px-6',
    secondaryLabel: 'Já tenho conta',
    secondaryClassName: 'px-6',
    tone: 'secondary',
  },
  'hero-mobile': {
    containerClassName: 'flex w-full items-center gap-4',
    primaryLabel: 'Abrir conta',
    primaryClassName:
      'h-12 flex-1 justify-center border-black bg-black text-surface hover:bg-black/90 focus-visible:ring-black',
    secondaryLabel: 'Já tenho conta',
    secondaryClassName:
      'h-12 flex-1 justify-center border-black text-black hover:bg-black/5 focus-visible:ring-black',
    tone: 'primary',
  },
};

export function HomeCtaButtons({ context }: HomeCtaButtonsProps) {
  const config = ctaByContext[context];
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return (
      <div className={config.containerClassName}>
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: 'solid',
            tone: config.tone,
            className: config.primaryClassName,
          })}
        >
          Acessar minha conta
        </Link>
      </div>
    );
  }

  return (
    <div className={config.containerClassName}>
      <Link
        href="/home/register"
        scroll={false}
        className={buttonVariants({
          variant: 'solid',
          tone: config.tone,
          className: config.primaryClassName,
        })}
      >
        {config.primaryLabel}
      </Link>
      <Link
        href="/home/login"
        scroll={false}
        className={buttonVariants({
          variant: 'outline',
          tone: config.tone,
          className: config.secondaryClassName,
        })}
      >
        {config.secondaryLabel}
      </Link>
    </div>
  );
}
