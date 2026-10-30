'use client';

import { useGetSessionQuery } from '../_state/bank-api';
import type { AuthenticatedUser } from '@/app/home/_services/auth-service';

export type AuthSessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type ServerAuthSession = {
  user: AuthenticatedUser;
};

type UseAuthSessionResult = {
  session: ServerAuthSession | null;
  status: AuthSessionStatus;
};

export function useAuthSession(): UseAuthSessionResult {
  const { data, isLoading, isFetching } = useGetSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || (isFetching && !data)) return { session: null, status: 'loading' };
  if (!data) return { session: null, status: 'unauthenticated' };
  return { session: { user: data.user }, status: 'authenticated' };
}
