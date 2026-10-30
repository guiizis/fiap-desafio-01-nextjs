import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthSession } from './use-auth-session';

const { useGetSessionQueryMock } = vi.hoisted(() => ({ useGetSessionQueryMock: vi.fn() }));

vi.mock('../_state/bank-api', () => ({ useGetSessionQuery: useGetSessionQueryMock }));

const user = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@mail.com',
  createdAt: '2026-10-29T10:00:00.000Z',
  accountBalanceInCents: 0,
};

describe('useAuthSession', () => {
  beforeEach(() => useGetSessionQueryMock.mockReset());

  it('expõe loading enquanto a consulta ainda não tem dados', () => {
    useGetSessionQueryMock.mockReturnValue({ isLoading: true, isFetching: true });
    const { result } = renderHook(() => useAuthSession());
    expect(result.current).toEqual({ session: null, status: 'loading' });
  });

  it('expõe a sessão compartilhada pelo cache', () => {
    useGetSessionQueryMock.mockReturnValue({ data: { user }, isLoading: false, isFetching: false });
    const { result } = renderHook(() => useAuthSession());
    expect(result.current).toEqual({ session: { user }, status: 'authenticated' });
  });

  it('mantém a sessão durante uma revalidação em segundo plano', () => {
    useGetSessionQueryMock.mockReturnValue({ data: { user }, isLoading: false, isFetching: true });
    const { result } = renderHook(() => useAuthSession());
    expect(result.current).toEqual({ session: { user }, status: 'authenticated' });
  });

  it('expõe estado não autenticado quando a consulta não retorna dados', () => {
    useGetSessionQueryMock.mockReturnValue({ isLoading: false, isFetching: false });
    const { result } = renderHook(() => useAuthSession());
    expect(result.current).toEqual({ session: null, status: 'unauthenticated' });
  });
});
