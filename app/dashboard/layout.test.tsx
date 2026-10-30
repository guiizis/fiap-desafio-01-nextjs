import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardLayout from './layout';

const { replaceMock, refreshMock, logoutAccountMock, useAuthSessionContextMock, dispatchMock } =
  vi.hoisted(() => ({
    replaceMock: vi.fn(),
    refreshMock: vi.fn(),
    logoutAccountMock: vi.fn(),
    useAuthSessionContextMock: vi.fn(),
    dispatchMock: vi.fn(),
  }));

vi.mock('./_state/hooks', () => ({ useAppDispatch: () => dispatchMock }));
vi.mock('./_state/bank-api', () => ({
  bankApi: { util: { resetApiState: () => ({ type: 'bankApi/reset' }) } },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock('@/app/home/_services/auth-service', () => ({
  logoutAccount: logoutAccountMock,
}));

vi.mock('@/app/context/auth-session-context', () => ({
  AuthSessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuthSessionContext: useAuthSessionContextMock,
}));

function authenticatedContext(name = 'Joana da Silva Oliveira') {
  return {
    session: {
      user: {
        name,
      },
    },
    status: 'authenticated',
    balanceInCents: 250000,
    statementEntries: [
      {
        id: '3',
        month: 'Abril',
        type: 'Deposito',
        amountInCents: 5000,
        date: 'data invalida',
      },
      {
        id: '1',
        month: 'Abril',
        type: 'Deposito',
        amountInCents: 250000,
        date: '21/04/2026',
      },
      {
        id: '2',
        month: 'Abril',
        type: 'Transferencia',
        amountInCents: -10000,
        date: '20/04/2026',
      },
      {
        id: '4',
        month: 'Abril',
        type: 'Deposito',
        amountInCents: 5000,
        date: 'outra data invalida',
      },
    ],
  };
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    refreshMock.mockClear();
    logoutAccountMock.mockReset();
    dispatchMock.mockClear();
    logoutAccountMock.mockResolvedValue({ ok: true, message: 'Sessão encerrada.' });
    useAuthSessionContextMock.mockReturnValue(authenticatedContext());
  });

  it('encerra a sessão pelo servidor e volta ao login', async () => {
    render(
      <DashboardLayout>
        <main>Conteúdo protegido</main>
      </DashboardLayout>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    await waitFor(() => expect(logoutAccountMock).toHaveBeenCalledOnce());
    expect(replaceMock).toHaveBeenCalledWith('/home/login');
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'bankApi/reset' });
  });

  it('renderiza container da area de dashboard com children', () => {
    render(
      <DashboardLayout>
        <main>Conteudo da area de dashboard</main>
      </DashboardLayout>
    );

    expect(screen.getByText('Conteudo da area de dashboard')).toBeInTheDocument();
    expect(screen.getByText(/joana da silva oliveira/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar saldo' }));
    expect(screen.getByRole('button', { name: 'Mostrar saldo' })).toBeInTheDocument();
  });

  it('redireciona para login quando sessao esta unauthenticated', () => {
    useAuthSessionContextMock.mockReturnValue({
      ...authenticatedContext(),
      session: null,
      status: 'unauthenticated',
      statementEntries: [],
    });

    const { container } = render(
      <DashboardLayout>
        <main>Conteudo protegido</main>
      </DashboardLayout>
    );

    expect(container).toBeEmptyDOMElement();
    expect(replaceMock).toHaveBeenCalledWith('/home/login');
  });

  it('nao renderiza children enquanto autenticacao esta carregando', () => {
    useAuthSessionContextMock.mockReturnValue({
      ...authenticatedContext(),
      session: null,
      status: 'loading',
      statementEntries: [],
    });

    const { container } = render(
      <DashboardLayout>
        <main>Conteudo protegido</main>
      </DashboardLayout>
    );

    expect(container).toBeEmptyDOMElement();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('usa nome completo como fallback quando primeiro nome esta vazio', () => {
    useAuthSessionContextMock.mockReturnValue(authenticatedContext(''));

    render(
      <DashboardLayout>
        <main>Conteudo da area de dashboard</main>
      </DashboardLayout>
    );

    expect(screen.getByText(/Olá, !/i)).toBeInTheDocument();
  });
});
