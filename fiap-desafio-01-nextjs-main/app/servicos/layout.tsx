import type { ReactNode } from "react";

type ServicosLayoutProps = {
  children: ReactNode;
};

export default function ServicosLayout({ children }: ServicosLayoutProps) {
  return <div className="flex min-h-screen flex-col bg-background">{children}</div>;
}
