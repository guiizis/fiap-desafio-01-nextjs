'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSessionProvider, useAuthSessionContext } from '@/app/lib/auth-session-context';
import { DashboardHeader } from './_components/dashboard-header';
import {
  normalizeStatementEntryType,
  type StatementEntry,
} from './_components/interfaces/statement-panel.interfaces';
import type { AuthSession } from '@/app/lib/auth-session';
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

function AuthGuard({ children }: { children: ReactNode }) {
  const { session, status } = useAuthSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/home/login');
    }
  }, [status, router]);

  if (status !== 'authenticated' || !session) {
    return null;
  }

  return <DashboardLayoutContent session={session}>{children}</DashboardLayoutContent>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthSessionProvider>
  );
}
