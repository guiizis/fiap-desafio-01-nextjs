'use client';

import type { AuthSession } from '@/app/lib/auth-session';
import { Dashboard } from './_components/dashboard';
import { DashboardHeader } from './_components/dashboard-header';
import {
  normalizeStatementEntryType,
  type StatementEntry,
} from './_components/interfaces/statement-panel.interfaces';
import { useAuthSessionContext } from '../lib/auth-session-context';

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

export default function DashboardPageContent() {
  const { session } = useAuthSessionContext();

  return (
    <Dashboard
      userFirstName={getUserFirstName(session!.user.name)}
      balanceInCents={session!.user.accountBalanceInCents}
      statementEntries={normalizeStatementEntries(session!.user.statementEntries)}
    />
  );
}
