"use client";

import type { AuthSession } from "../lib/auth-session";
import { ServicesDashboard } from "./_components/services-dashboard";
import { ServicosHeader } from "./_components/servicos-header";
import { withAuth } from "./_components/with-auth";
import { useAuthSession } from "./_hooks/use-auth-session";

type ServicosPageContentProps = {
  session: AuthSession;
};

function getUserFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/);
  return firstName || fullName;
}

function ServicosPageContent({ session }: ServicosPageContentProps) {
  return (
    <>
      <ServicosHeader userName={session.user.name} />
      <main className="flex-1">
        <ServicesDashboard
          userFirstName={getUserFirstName(session.user.name)}
          balanceInCents={session.user.accountBalanceInCents}
          statementEntries={session.user.statementEntries}
        />
      </main>
    </>
  );
}

const GuardedServicosPageContent = withAuth(ServicosPageContent);

export default function ServicosPage() {
  const { session, status } = useAuthSession();

  return <GuardedServicosPageContent authStatus={status} session={session} />;
}
