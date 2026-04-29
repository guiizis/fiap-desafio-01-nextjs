'use client';

import { useAuthSessionContext } from '@/app/context/auth-session-context';

export default function TransactionsPage() {
  const { session } = useAuthSessionContext();

  if (!session) {
    return null;
  }

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Transações</h1>
      <p className="mt-4 text-muted-foreground">Histórico de transações em desenvolvimento.</p>
    </main>
  );
}
