import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { HomeCtaButtons } from './home-cta-buttons';
import { MobileMenuButton } from './mobile-menu-button';

export function HomeHeader() {
  return (
    <header className="w-full bg-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 lg:px-6">
        <div className="hidden items-center justify-between mobile:flex">
          <MobileMenuButton />
          <Logo size="md" variant="full" tone="secondary" priority alt="McIntosh Bank mobile" />
        </div>

        <div className="flex items-center justify-between gap-6 mobile:hidden">
          <div className="flex items-center gap-8 lg:gap-12">
            <Logo
              size="md"
              variant="symbol"
              tone="secondary"
              priority
              alt="McIntosh Bank símbolo tablet"
              className="hidden tablet:block desktop:hidden"
            />
            <Logo
              size="lg"
              variant="full"
              tone="secondary"
              priority
              alt="McIntosh Bank"
              className="hidden desktop:block"
            />
            <nav aria-label="Navegação Header">
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/sobre"
                    className="text-body-md font-semibold text-secondary hover:text-menu-hover"
                  >
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-body-md font-semibold text-secondary hover:text-menu-hover"
                  >
                    Serviços
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <HomeCtaButtons context="header" />
        </div>
      </div>
    </header>
  );
}
