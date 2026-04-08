import type { ReactNode } from "react";
import { ServicosHeader } from "./_components/servicos-header";

type ServicosLayoutProps = {
  children: ReactNode;
};

export default function ServicosLayout({ children }: ServicosLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ServicosHeader userName="Joana Fonseca Gomes" />
      {children}
    </div>
  );
}
