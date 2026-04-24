'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { Dashboard } from './_components/dashboard';
import { DashboardHeader } from './_components/dashboard-header';
import { withAuth } from './_components/with-auth';
import { useAuthSession } from './_hooks/use-auth-session';

type DashboardPageContentProps = {
  session: AuthSession;
};

function getUserFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/);
  return firstName || fullName;
}

function DashboardPageContent({ session }: DashboardPageContentProps) {
  return (
    <>
      <DashboardHeader userName={session.user.name} />
      <main className="flex-1">
        <Dashboard
          userFirstName={getUserFirstName(session.user.name)}
          balanceInCents={session.user.accountBalanceInCents}
          statementEntries={session.user.statementEntries}
        />
      </main>
    </>
  );
}

const GuardedDashboardPageContent = withAuth(DashboardPageContent);

export default function DashboardPage() {
  const { session, status } = useAuthSession();

  return <GuardedDashboardPageContent authStatus={status} session={session} />;
}
