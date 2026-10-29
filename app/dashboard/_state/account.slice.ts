import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getSignedTransactionAmount } from '../_domain/transaction-rules';
import type { StatementEntry, StatementEntryType } from '../_domain/transaction.types';

export type AccountState = {
  currentBalanceInCents: number;
  currentStatementEntries: StatementEntry[];
};

type HydrateAccountPayload = {
  balanceInCents: number;
  statementEntries: readonly StatementEntry[];
};

type EditStatementEntryPayload = {
  entryId: string;
  nextAmountInCents: number;
  nextType: StatementEntryType;
  nextMonth: string;
  nextDate: string;
};

export const initialAccountState: AccountState = {
  currentBalanceInCents: 0,
  currentStatementEntries: [],
};

const accountSlice = createSlice({
  name: 'account',
  initialState: initialAccountState,
  reducers: {
    accountHydrated(_state, action: PayloadAction<HydrateAccountPayload>) {
      return {
        currentBalanceInCents: action.payload.balanceInCents,
        currentStatementEntries: [...action.payload.statementEntries],
      };
    },
    transactionAppended(state, action: PayloadAction<StatementEntry>) {
      state.currentBalanceInCents += action.payload.amountInCents;
      state.currentStatementEntries.unshift(action.payload);
    },
    statementEntryDeleted(state, action: PayloadAction<string>) {
      const entryIndex = state.currentStatementEntries.findIndex(
        (entry) => entry.id === action.payload
      );
      if (entryIndex === -1) return;

      const [entry] = state.currentStatementEntries.splice(entryIndex, 1);
      if (entry) state.currentBalanceInCents -= entry.amountInCents;
    },
    statementEntryEdited(state, action: PayloadAction<EditStatementEntryPayload>) {
      const entry = state.currentStatementEntries.find(
        (currentEntry) => currentEntry.id === action.payload.entryId
      );
      if (!entry) return;

      const normalizedAmountInCents = getSignedTransactionAmount(
        action.payload.nextType,
        action.payload.nextAmountInCents
      );
      state.currentBalanceInCents =
        state.currentBalanceInCents - entry.amountInCents + normalizedAmountInCents;
      entry.type = action.payload.nextType;
      entry.amountInCents = normalizedAmountInCents;
      entry.month = action.payload.nextMonth;
      entry.date = action.payload.nextDate;
    },
  },
});

export const { accountHydrated, transactionAppended, statementEntryDeleted, statementEntryEdited } =
  accountSlice.actions;

export const accountReducer = accountSlice.reducer;
