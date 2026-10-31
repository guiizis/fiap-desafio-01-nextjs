import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionType } from '../_domain/transaction.types';
import { bankApi } from './bank-api';
import { makeStore } from './store';

const user = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@mail.com',
  createdAt: '2026-10-29T10:00:00.000Z',
  accountBalanceInCents: 8000,
};

function jsonResponse(body: object) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('bankApi', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((request: Request) => {
        if (request.url.endsWith('/auth/session')) return Promise.resolve(jsonResponse({ user }));
        if (request.url.endsWith('/auth/login')) {
          return Promise.resolve(jsonResponse({ message: 'Login realizado com sucesso.', user }));
        }
        return Promise.resolve(jsonResponse({ balanceInCents: 8000, transactions: [] }));
      })
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('autentica usando a mesma camada de dados da sessão', async () => {
    const store = makeStore();
    const result = await store
      .dispatch(
        bankApi.endpoints.login.initiate({
          email: 'maria@mail.com',
          password: 'senha-segura',
        })
      )
      .unwrap();

    expect(result).toEqual({ message: 'Login realizado com sucesso.', user });
    const request = vi.mocked(fetch).mock.calls[0]?.[0] as Request;
    expect(request.url).toMatch(/\/backend\/auth\/login$/);
    expect(request.method).toBe('POST');
  });

  it('deduplica consultas simultâneas da mesma sessão', async () => {
    const store = makeStore();
    const first = store.dispatch(bankApi.endpoints.getSession.initiate());
    const second = store.dispatch(bankApi.endpoints.getSession.initiate());

    await expect(first.unwrap()).resolves.toEqual({ user });
    await expect(second.unwrap()).resolves.toEqual({ user });
    expect(fetch).toHaveBeenCalledOnce();
    first.unsubscribe();
    second.unsubscribe();
  });

  it('invalida a conta e refaz a consulta após criar, editar e excluir', async () => {
    const store = makeStore();
    const account = store.dispatch(bankApi.endpoints.getAccount.initiate());
    await account.unwrap();

    const transaction = {
      type: TransactionType.DEPOSIT,
      amountInCents: 1500,
      transactionDate: '2026-10-29',
    };
    await store.dispatch(bankApi.endpoints.createTransaction.initiate(transaction)).unwrap();
    await store
      .dispatch(bankApi.endpoints.editTransaction.initiate({ ...transaction, entryId: 'tx-1' }))
      .unwrap();
    await store.dispatch(bankApi.endpoints.deleteTransaction.initiate('tx-1')).unwrap();

    const requests = vi.mocked(fetch).mock.calls.map(([request]) => request as Request);
    expect(requests.map((request) => request.method)).toEqual([
      'GET',
      'POST',
      'GET',
      'PUT',
      'GET',
      'DELETE',
      'GET',
    ]);
    expect(requests[1]?.url).toMatch(/\/backend\/transactions$/);
    expect(requests[3]?.url).toMatch(/\/backend\/transactions\/tx-1$/);
    expect(requests[5]?.url).toMatch(/\/backend\/transactions\/tx-1$/);
    account.unsubscribe();
  });
});
