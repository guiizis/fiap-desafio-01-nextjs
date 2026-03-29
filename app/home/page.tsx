import { HomeHeader } from "./_components/home-header";
import { HomeFooter } from "./_components/home-footer";
import { BenefitsSection } from "./_sections/benefits-section";
import { HeroSection } from "./_sections/hero-section";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHeader />
      <main className="flex-1 bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-background)_72%)]">
        <HeroSection />
        <BenefitsSection />
      </main>
      <HomeFooter />
    </div>
  );
}
