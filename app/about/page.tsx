import { HomeFooter } from '../home/_components/home-footer';
import { HomeHeader } from '../home/_components/home-header';
import { AboutContent } from './_components/about-content';

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <HomeHeader />
      <main className="flex-1 px-4 py-8 md:px-8 md:py-12">
        <AboutContent />
      </main>
      <HomeFooter />
    </div>
  );
}
