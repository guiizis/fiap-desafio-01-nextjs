'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { DashboardHeader } from '../_components/dashboard-header';
import { withAuth } from '../_components/with-auth';
import { useAuthSession } from '../_hooks/use-auth-session';

type OtherServicesPageContentProps = {
  session: AuthSession;
};

function OtherServicesPageContent(_props: OtherServicesPageContentProps) {
  return (
    <>
      <DashboardHeader userName={_props.session.user.name} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Outros Serviços</h1>
        <p className="mt-4 text-muted-foreground">
          Gestão de outros serviços em desenvolvimento.
        </p>
      </main>
    </>
  );
}

const GuardedOtherServicesPageContent = withAuth(OtherServicesPageContent);

export default function OtherServicesPage() {
  const { session, status } = useAuthSession();

  return <GuardedOtherServicesPageContent authStatus={status} session={session} />;
}