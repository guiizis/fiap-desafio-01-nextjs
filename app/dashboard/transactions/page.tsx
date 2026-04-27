'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { DashboardHeader } from '../_components/dashboard-header';
import { withAuth } from '../_components/with-auth';
import { useAuthSession } from '../_hooks/use-auth-session';

type TransactionsPageContentProps = {
  session: AuthSession;
};

function TransactionsPageContent(_props: TransactionsPageContentProps) {
  return (
    <>
      <DashboardHeader userName={_props.session.user.name} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="mt-4 text-muted-foreground">Histórico de transações em desenvolvimento.</p>
      </main>
    </>
  );
}

const GuardedTransactionsPageContent = withAuth(TransactionsPageContent);

export default function TransactionsPage() {
  const { session, status } = useAuthSession();

  return <GuardedTransactionsPageContent authStatus={status} session={session} />;
}
