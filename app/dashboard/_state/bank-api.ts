import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  EditStatementEntryPayload,
  NewTransactionPayload,
} from '../_domain/transaction.types';
import type { AuthenticatedUser } from '@/app/home/_services/auth-service';

export type ApiTransaction = {
  id: string;
  type: 'deposit' | 'transfer';
  amountInCents: number;
  date: string;
};

export type AccountSnapshot = {
  balanceInCents: number;
  transactions: ApiTransaction[];
};

type SessionResponse = {
  user: AuthenticatedUser;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = SessionResponse & {
  message: string;
};

/* v8 ignore next -- fallback usado apenas durante a geração do bundle do servidor */
const apiOrigin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;

export const bankApi = createApi({
  reducerPath: 'bankApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiOrigin}/backend`,
  }),
  tagTypes: ['Session', 'Account'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getSession: builder.query<SessionResponse, void>({
      query: () => '/auth/session',
      providesTags: ['Session'],
      keepUnusedDataFor: 60,
    }),
    getAccount: builder.query<AccountSnapshot, void>({
      query: () => '/transactions',
      providesTags: ['Account'],
      keepUnusedDataFor: 60,
    }),
    createTransaction: builder.mutation<void, NewTransactionPayload>({
      query: (payload) => ({
        url: '/transactions',
        method: 'POST',
        body: {
          type: payload.type,
          amountInCents: payload.amountInCents,
          date: payload.transactionDate,
        },
      }),
      invalidatesTags: ['Account'],
    }),
    editTransaction: builder.mutation<void, EditStatementEntryPayload>({
      query: (payload) => ({
        url: `/transactions/${payload.entryId}`,
        method: 'PUT',
        body: {
          type: payload.type,
          amountInCents: payload.amountInCents,
          date: payload.transactionDate,
        },
      }),
      invalidatesTags: ['Account'],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (entryId) => ({
        url: `/transactions/${entryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetSessionQuery,
  useGetAccountQuery,
  useCreateTransactionMutation,
  useEditTransactionMutation,
  useDeleteTransactionMutation,
} = bankApi;
