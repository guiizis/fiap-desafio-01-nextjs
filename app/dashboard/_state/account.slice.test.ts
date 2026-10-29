import { describe, expect, it } from 'vitest';
import { StatementEntryType } from '../_domain/transaction.types';
import {
  accountHydrated,
  accountReducer,
  statementEntryDeleted,
  statementEntryEdited,
  transactionAppended,
} from './account.slice';

const baseEntries = [
  {
    id: '1',
    month: 'Novembro',
    type: StatementEntryType.DEPOSIT,
    amountInCents: 15_000,
    date: '18/11/2022',
  },
  {
    id: '2',
    month: 'Novembro',
    type: StatementEntryType.TRANSFER,
    amountInCents: -5_000,
    date: '21/11/2022',
  },
] as const;

const hydratedState = () =>
  accountReducer(
    undefined,
    accountHydrated({ balanceInCents: 250_000, statementEntries: baseEntries })
  );

describe('account slice', () => {
  it('inicia vazio e hidrata a conta clonando o extrato', () => {
    const initialState = accountReducer(undefined, { type: 'unknown' });
    expect(initialState).toEqual({ currentBalanceInCents: 0, currentStatementEntries: [] });

    const state = hydratedState();
    expect(state.currentBalanceInCents).toBe(250_000);
    expect(state.currentStatementEntries).toEqual(baseEntries);
    expect(state.currentStatementEntries).not.toBe(baseEntries);
  });

  it('adiciona lancamento e reage atualizando saldo e extrato', () => {
    const entry = { ...baseEntries[0], id: '3', amountInCents: 7_000 };
    const state = accountReducer(hydratedState(), transactionAppended(entry));

    expect(state.currentBalanceInCents).toBe(257_000);
    expect(state.currentStatementEntries[0]).toEqual(entry);
  });

  it('remove lancamento e reverte seu efeito no saldo', () => {
    const state = accountReducer(hydratedState(), statementEntryDeleted('2'));
    expect(state.currentBalanceInCents).toBe(255_000);
    expect(state.currentStatementEntries.map((entry) => entry.id)).toEqual(['1']);
  });

  it('mantem a referencia quando tenta remover um id inexistente', () => {
    const initialState = hydratedState();
    expect(accountReducer(initialState, statementEntryDeleted('inexistente'))).toBe(initialState);
  });

  it('edita transferencia normalizando valor e recalculando saldo', () => {
    const state = accountReducer(
      hydratedState(),
      statementEntryEdited({
        entryId: '2',
        nextAmountInCents: 7_000,
        nextType: StatementEntryType.TRANSFER,
        nextMonth: 'Dezembro',
        nextDate: '10/12/2022',
      })
    );

    expect(state.currentBalanceInCents).toBe(248_000);
    expect(state.currentStatementEntries[1]).toEqual({
      id: '2',
      month: 'Dezembro',
      type: StatementEntryType.TRANSFER,
      amountInCents: -7_000,
      date: '10/12/2022',
    });
  });

  it('edita deposito normalizando valor positivo', () => {
    const state = accountReducer(
      hydratedState(),
      statementEntryEdited({
        entryId: '1',
        nextAmountInCents: -20_000,
        nextType: StatementEntryType.DEPOSIT,
        nextMonth: 'Janeiro',
        nextDate: '02/01/2023',
      })
    );

    expect(state.currentBalanceInCents).toBe(255_000);
    expect(state.currentStatementEntries[0]?.amountInCents).toBe(20_000);
  });

  it('mantem a referencia quando tenta editar um id inexistente', () => {
    const initialState = hydratedState();
    const action = statementEntryEdited({
      entryId: 'inexistente',
      nextAmountInCents: 100,
      nextType: StatementEntryType.DEPOSIT,
      nextMonth: 'Novembro',
      nextDate: '18/11/2022',
    });

    expect(accountReducer(initialState, action)).toBe(initialState);
  });
});
