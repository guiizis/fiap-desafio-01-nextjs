import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="flex min-h-screen flex-col bg-background">{children}</div>;
}
