import { describe, expect, it } from "vitest";
import {
  accountReducer,
  createAccountState,
  type AccountAction,
} from "./account.reducer";

const baseEntries = [
  { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
  { id: "2", month: "Novembro", type: "Transferencia", amountInCents: -5000, date: "21/11/2022" },
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
      type: "hydrate-from-props",
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
      type: "Deposito" as const,
      amountInCents: 7000,
      date: "21/11/2022",
    };

    const nextState = accountReducer(initialState, {
      type: "append-transaction-entry",
      entry: newEntry,
    });

    expect(nextState.currentBalanceInCents).toBe(257000);
    expect(nextState.currentStatementEntries[0]).toEqual(newEntry);
  });

  it("remove lancamento existente e reverte saldo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "delete-statement-entry",
      entryId: "2",
    });

    expect(nextState.currentBalanceInCents).toBe(255000);
    expect(nextState.currentStatementEntries).toHaveLength(1);
    expect(nextState.currentStatementEntries[0]?.id).toBe("1");
  });

  it("mantem estado quando delete recebe id inexistente", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "delete-statement-entry",
      entryId: "inexistente",
    });

    expect(nextState).toBe(initialState);
  });

  it("edita transferencia normalizando para valor negativo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "edit-statement-entry",
      entryId: "2",
      nextAmountInCents: 7000,
      nextType: "Transferencia",
      nextMonth: "Dezembro",
      nextDate: "10/12/2022",
    });

    expect(nextState.currentBalanceInCents).toBe(248000);
    const editedTransfer = nextState.currentStatementEntries.find((entry) => entry.id === "2");
    expect(editedTransfer?.amountInCents).toBe(-7000);
    expect(editedTransfer?.type).toBe("Transferencia");
    expect(editedTransfer?.month).toBe("Dezembro");
    expect(editedTransfer?.date).toBe("10/12/2022");
  });

  it("edita deposito normalizando para valor positivo", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "edit-statement-entry",
      entryId: "1",
      nextAmountInCents: -20000,
      nextType: "Deposito",
      nextMonth: "Janeiro",
      nextDate: "02/01/2023",
    });

    expect(nextState.currentBalanceInCents).toBe(255000);
    const editedDeposit = nextState.currentStatementEntries.find((entry) => entry.id === "1");
    expect(editedDeposit?.amountInCents).toBe(20000);
    expect(editedDeposit?.type).toBe("Deposito");
    expect(editedDeposit?.month).toBe("Janeiro");
    expect(editedDeposit?.date).toBe("02/01/2023");
  });

  it("mantem estado quando edit recebe id inexistente", () => {
    const initialState = createAccountState(250000, baseEntries);

    const nextState = accountReducer(initialState, {
      type: "edit-statement-entry",
      entryId: "inexistente",
      nextAmountInCents: 100,
      nextType: "Deposito",
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
