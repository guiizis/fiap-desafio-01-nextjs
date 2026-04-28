'use client';

import { useAuthSessionContext } from '@/app/context/auth-session-context';
import { StatementPanel } from '../_components/statement-panel';

export default function TransactionsPage() {
  const { session } = useAuthSessionContext();

  if (!session) {
    return null;
  }

  return (
    <StatementPanel
      title="Transações"
      ariaLabel="Painel de transações"
      entries={session.user.statementEntries}
    />
  );
}
