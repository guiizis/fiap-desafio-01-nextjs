import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import DashboardLayout from './layout';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('@/app/context/auth-session-context', () => ({
  AuthSessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuthSessionContext: () => ({
    session: {
      user: {
        name: 'Joana da Silva Oliveira',
      },
    },
    status: 'authenticated',
    balanceInCents: 250000,
    statementEntries: [
      {
        id: '1',
        month: 'Abril',
        type: 'Deposito',
        amountInCents: 250000,
        date: '21/04/2026',
      },
    ],
  }),
}));

describe('DashboardLayout', () => {
  it('renderiza container da area de dashboard com children', () => {
    render(
      <DashboardLayout>
        <main>Conteudo da area de dashboard</main>
      </DashboardLayout>
    );

    expect(screen.getByText('Conteudo da area de dashboard')).toBeInTheDocument();
    expect(screen.getByText(/joana da silva oliveira/i)).toBeInTheDocument();
  });
});
