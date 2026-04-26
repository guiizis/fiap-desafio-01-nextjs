import { describe, expect, it } from "vitest";
import {
  AccountActionType,
  accountReducer,
  createAccountState,
  type AccountAction,
} from "./account.reducer";
import { StatementEntryType } from "../_components/interfaces/statement-panel.interfaces";

const baseEntries = [
  { id: "1", month: "Novembro", type: StatementEntryType.DEPOSITO, amountInCents: 15000, date: "18/11/2022" },
  { id: "2", month: "Novembro", type: StatementEntryType.TRANSFERENCIA, amountInCents: -5000, date: "21/11/2022" },
] as const;

describe("account.reducer", () => {
  it("cria estado inicial com clone do extrato", () => {
    const state = createAccountState(250000, baseEntries);

    expect(state.currentBalanceInCents).toBe(250000);
    expect(state.currentStatementEntries).toEqual(baseEntries);
    expect(state.currentStatementEntries).not.toBe(baseEntries);
  });

  it("hidrata estado a partir das props", () => {
    const initialState = createAccountState(100, []);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.HYDRATE_FROM_PROPS,
      balanceInCents: 250000,
      statementEntries: baseEntries,
    });

    expect(nextState.currentBalanceInCents).toBe(250000);
    expect(nextState.currentStatementEntries).toEqual(baseEntries);
  });

  it("adiciona lancamento e atualiza saldo", () => {
    const initialState = createAccountState(250000, baseEntries);
    const newEntry = {
      id: "3",
      month: "Novembro",
      type: StatementEntryType.DEPOSITO,
      amountInCents: 7000,
      date: "21/11/2022",
    };

    const nextState = accountReducer(initialState, {
      type: AccountActionType.APPEND_TRANSACTION_ENTRY,
      entry: newEntry,
    });

    expect(nextState.currentBalanceInCents).toBe(257000);
    expect(nextState.currentStatementEntries[0]).toEqual(newEntry);
  });

  it("remove lancamento existente e reverte saldo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.DELETE_STATEMENT_ENTRY,
      entryId: "2",
    });

    expect(nextState.currentBalanceInCents).toBe(255000);
    expect(nextState.currentStatementEntries).toHaveLength(1);
    expect(nextState.currentStatementEntries[0]?.id).toBe("1");
  });

  it("mantem estado quando delete recebe id inexistente", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.DELETE_STATEMENT_ENTRY,
      entryId: "inexistente",
    });

    expect(nextState).toBe(initialState);
  });

  it("edita transferencia normalizando para valor negativo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.EDIT_STATEMENT_ENTRY,
      entryId: "2",
      nextAmountInCents: 7000,
      nextType: StatementEntryType.TRANSFERENCIA,
      nextMonth: "Dezembro",
      nextDate: "10/12/2022",
    });

    expect(nextState.currentBalanceInCents).toBe(248000);
    const editedTransfer = nextState.currentStatementEntries.find((entry) => entry.id === "2");
    expect(editedTransfer?.amountInCents).toBe(-7000);
    expect(editedTransfer?.type).toBe(StatementEntryType.TRANSFERENCIA);
    expect(editedTransfer?.month).toBe("Dezembro");
    expect(editedTransfer?.date).toBe("10/12/2022");
  });

  it("edita deposito normalizando para valor positivo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.EDIT_STATEMENT_ENTRY,
      entryId: "1",
      nextAmountInCents: -20000,
      nextType: StatementEntryType.DEPOSITO,
      nextMonth: "Janeiro",
      nextDate: "02/01/2023",
    });

    expect(nextState.currentBalanceInCents).toBe(255000);
    const editedDeposit = nextState.currentStatementEntries.find((entry) => entry.id === "1");
    expect(editedDeposit?.amountInCents).toBe(20000);
    expect(editedDeposit?.type).toBe(StatementEntryType.DEPOSITO);
    expect(editedDeposit?.month).toBe("Janeiro");
    expect(editedDeposit?.date).toBe("02/01/2023");
  });

  it("mantem estado quando edit recebe id inexistente", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: AccountActionType.EDIT_STATEMENT_ENTRY,
      entryId: "inexistente",
      nextAmountInCents: 100,
      nextType: StatementEntryType.DEPOSITO,
      nextMonth: "Novembro",
      nextDate: "18/11/2022",
    });

    expect(nextState).toBe(initialState);
  });

  it("retorna estado atual para acao desconhecida", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "acao-desconhecida",
    } as unknown as AccountAction);

    expect(nextState).toBe(initialState);
  });
});
