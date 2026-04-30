'use client';

import { useAuthSessionContext } from '@/app/context/auth-session-context';
import { NewTransactionPanel } from '../_components/new-transaction-panel';

export default function HomeDashboardPage() {
  const { session } = useAuthSessionContext();

  if (!session) {
    return null;
  }

  return <NewTransactionPanel />;
}
