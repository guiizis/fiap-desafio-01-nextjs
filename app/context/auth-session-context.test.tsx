import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionType } from '../dashboard/_domain/transaction.types';
import { AuthSessionProvider, useAuthSessionContext } from './auth-session-context';

const mocks = vi.hoisted(() => ({
  useAuthSession: vi.fn(),
  useGetAccountQuery: vi.fn(),
  createTrigger: vi.fn(),
  editTrigger: vi.fn(),
  deleteTrigger: vi.fn(),
}));

vi.mock('../dashboard/_hooks/use-auth-session', () => ({ useAuthSession: mocks.useAuthSession }));
vi.mock('../dashboard/_state/bank-api', () => ({
  useGetAccountQuery: mocks.useGetAccountQuery,
  useCreateTransactionMutation: () => [mocks.createTrigger],
  useEditTransactionMutation: () => [mocks.editTrigger],
  useDeleteTransactionMutation: () => [mocks.deleteTrigger],
}));

const user = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@mail.com',
  createdAt: '2026-10-29T10:00:00.000Z',
  accountBalanceInCents: 8000,
};
type CapturedContext = ReturnType<typeof useAuthSessionContext>;

function Consumer({ capture = vi.fn() }: { capture?: (value: CapturedContext) => void }) {
  const context = useAuthSessionContext();
  capture(context);
  return (
    <div>
      <span data-testid="status">{context.status}</span>
      <span data-testid="balance">{context.balanceInCents}</span>
      <span data-testid="entries">{context.statementEntries.length}</span>
    </div>
  );
}

const successfulMutation = () => ({ unwrap: vi.fn().mockResolvedValue(undefined) });

describe('AuthSessionProvider com RTK Query', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetAccountQuery.mockReturnValue({
      isLoading: false,
      data: {
        balanceInCents: 8000,
        transactions: [
          { id: '1', type: 'deposit', amountInCents: 10000, date: '2026-10-28' },
          { id: '2', type: 'transfer', amountInCents: -2000, date: 'data-inválida' },
        ],
      },
    });
    mocks.createTrigger.mockReturnValue(successfulMutation());
    mocks.editTrigger.mockReturnValue(successfulMutation());
    mocks.deleteTrigger.mockReturnValue(successfulMutation());
  });

  it('pula a consulta da conta enquanto não existe sessão autenticada', () => {
    mocks.useAuthSession.mockReturnValue({ session: null, status: 'unauthenticated' });
    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
    expect(mocks.useGetAccountQuery).toHaveBeenCalledWith(undefined, { skip: true });
  });

  it('expõe saldo e converte as transações armazenadas no cache', () => {
    mocks.useAuthSession.mockReturnValue({ session: { user }, status: 'authenticated' });
    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('balance')).toHaveTextContent('8000');
    expect(screen.getByTestId('entries')).toHaveTextContent('2');
  });

  it('mantém loading durante a primeira consulta da conta', () => {
    mocks.useAuthSession.mockReturnValue({ session: { user }, status: 'authenticated' });
    mocks.useGetAccountQuery.mockReturnValue({ isLoading: true });
    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('loading');
  });

  it('dispara as três mutações pelo RTK Query', async () => {
    mocks.useAuthSession.mockReturnValue({ session: { user }, status: 'authenticated' });
    const capture = vi.fn();
    render(
      <AuthSessionProvider>
        <Consumer capture={capture} />
      </AuthSessionProvider>
    );
    const context = capture.mock.calls.at(-1)?.[0] as CapturedContext;
    const transaction = {
      type: TransactionType.DEPOSIT,
      amountInCents: 1000,
      transactionDate: '2026-10-29',
    };
    await act(async () => {
      await expect(context.onSubmitTransaction(transaction)).resolves.toEqual({ ok: true });
      await expect(context.onEditStatementEntry({ ...transaction, entryId: '1' })).resolves.toEqual(
        { ok: true }
      );
      await expect(context.onDeleteStatementEntry('1')).resolves.toEqual({ ok: true });
    });
    expect(mocks.createTrigger).toHaveBeenCalledWith(transaction);
    expect(mocks.editTrigger).toHaveBeenCalledWith({ ...transaction, entryId: '1' });
    expect(mocks.deleteTrigger).toHaveBeenCalledWith('1');
  });

  it('preserva a mensagem retornada por uma mutação rejeitada', async () => {
    mocks.useAuthSession.mockReturnValue({ session: { user }, status: 'authenticated' });
    mocks.createTrigger.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({ data: { message: 'Saldo insuficiente.' } }),
    });
    const capture = vi.fn();
    render(
      <AuthSessionProvider>
        <Consumer capture={capture} />
      </AuthSessionProvider>
    );
    const context = capture.mock.calls.at(-1)?.[0] as CapturedContext;
    await expect(
      context.onSubmitTransaction({
        type: TransactionType.TRANSFER,
        amountInCents: 999999,
        transactionDate: '2026-10-29',
      })
    ).resolves.toEqual({ ok: false, message: 'Saldo insuficiente.' });
  });

  it('usa mensagem segura quando a falha não traz resposta da API', async () => {
    mocks.useAuthSession.mockReturnValue({ session: { user }, status: 'authenticated' });
    mocks.deleteTrigger.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error('offline')),
    });
    const capture = vi.fn();
    render(
      <AuthSessionProvider>
        <Consumer capture={capture} />
      </AuthSessionProvider>
    );
    const context = capture.mock.calls.at(-1)?.[0] as CapturedContext;
    await expect(context.onDeleteStatementEntry('1')).resolves.toEqual({
      ok: false,
      message: 'Não foi possível concluir a operação.',
    });
  });

  it('falha claramente quando o hook é usado fora do provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Consumer />)).toThrow(
      'useAuthSessionContext must be used within an AuthSessionProvider'
    );
    consoleError.mockRestore();
  });
});
