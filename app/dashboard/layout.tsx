'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { DashboardHeader } from './_components/dashboard-header';
import {
  normalizeStatementEntryType,
  type StatementEntry,
} from './_components/interfaces/statement-panel.interfaces';
import { withAuth } from './_components/with-auth';
import { useAuthSession } from './_hooks/use-auth-session';
import { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
  session: AuthSession;
};

function getUserFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/);
  return firstName || fullName;
}

function normalizeStatementEntries(
  entries: AuthSession['user']['statementEntries']
): StatementEntry[] {
  return entries.map((entry) => ({
    ...entry,
    type: normalizeStatementEntryType(entry.type),
  }));
}

function DashboardLayoutContent({ session, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <DashboardHeader userName={session.user.name} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

const GuardedDashboardLayoutContent = withAuth(DashboardLayoutContent);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, status } = useAuthSession();

  return (
    <GuardedDashboardLayoutContent authStatus={status} session={session}>
      {children}
    </GuardedDashboardLayoutContent>
  );
}
