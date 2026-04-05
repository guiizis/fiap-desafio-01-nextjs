import type { ReactNode } from "react";
import { HomeFooter } from "./_components/home-footer";
import { HomeHeader } from "./_components/home-header";

type HomeLayoutProps = {
  children: ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHeader />
      {children}
      <HomeFooter />
    </div>
  );
}
