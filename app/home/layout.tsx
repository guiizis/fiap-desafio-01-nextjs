import type { ReactNode } from "react";
import { HomeFooter } from "./_components/home-footer";
import { HomeHeader } from "./_components/home-header";
import { BenefitsSection } from "./_sections/benefits-section";
import { HeroSection } from "./_sections/hero-section";

type HomeLayoutProps = {
  children: ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHeader />
      <div className="relative flex-1">
        <main className="flex-1 bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-background)_72%)]">
          <HeroSection />
          <BenefitsSection />
        </main>
        {children}
      </div>
      <HomeFooter />
    </div>
  );
}
