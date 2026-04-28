'use client';

import { useAuthSessionContext } from '@/app/lib/auth-session-context';

export default function HomeDashboardPage() {
  const { session } = useAuthSessionContext();

  if (!session) {
    return null;
  }

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Início</h1>
      <p className="mt-4 text-muted-foreground">Página inicial do dashboard em desenvolvimento.</p>
    </main>
  );
}
