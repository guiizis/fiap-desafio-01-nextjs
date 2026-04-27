'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { DashboardHeader } from '../_components/dashboard-header';
import { withAuth } from '../_components/with-auth';
import { useAuthSession } from '../_hooks/use-auth-session';

type HomeDashboardPageContentProps = {
  session: AuthSession;
};

function HomeDashboardPageContent(_props: HomeDashboardPageContentProps) {
  return (
    <>
      <DashboardHeader userName={_props.session.user.name} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Início</h1>
        <p className="mt-4 text-muted-foreground">
          Página inicial do dashboard em desenvolvimento.
        </p>
      </main>
    </>
  );
}

const GuardedHomeDashboardPageContent = withAuth(HomeDashboardPageContent);

export default function HomeDashboardPage() {
  const { session, status } = useAuthSession();

  return <GuardedHomeDashboardPageContent authStatus={status} session={session} />;
}