import { HomeHeader } from "./_components/home-header";
import { HomeFooter } from "./_components/home-footer";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHeader />
      <HomeFooter />
    </main>
  );
}
