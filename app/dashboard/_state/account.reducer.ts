import type { StatementEntry } from "../_components/interfaces/statement-panel.interfaces";

export type AccountState = {
  currentBalanceInCents: number;
  currentStatementEntries: StatementEntry[];
};

export type AccountAction =
  | {
    type: "hydrate-from-props";
    balanceInCents: number;
    statementEntries: readonly StatementEntry[];
  }
  | {
    type: "append-transaction-entry";
    entry: StatementEntry;
  }
  | {
    type: "delete-statement-entry";
    entryId: string;
  }
  | {
    type: "edit-statement-entry";
    entryId: string;
    nextAmountInCents: number;
    nextType: "Deposito" | "Transferencia";
    nextMonth: string;
    nextDate: string;
  };

export function createAccountState(
  balanceInCents: number,
  statementEntries: readonly StatementEntry[]
): AccountState {
  return {
    currentBalanceInCents: balanceInCents,
    currentStatementEntries: [...statementEntries],
  };
}

export function accountReducer(
  state: AccountState,
  action: AccountAction
): AccountState {
  switch (action.type) {
    case "hydrate-from-props":
      return createAccountState(action.balanceInCents, action.statementEntries);

    case "append-transaction-entry":
      return {
        currentBalanceInCents: state.currentBalanceInCents + action.entry.amountInCents,
        currentStatementEntries: [action.entry, ...state.currentStatementEntries],
      };

    case "delete-statement-entry": {
      const entryToDelete = state.currentStatementEntries.find((entry) => entry.id === action.entryId);
      if (!entryToDelete) {
        return state;
      }

      return {
        currentBalanceInCents: state.currentBalanceInCents - entryToDelete.amountInCents,
        currentStatementEntries: state.currentStatementEntries.filter(
          (entry) => entry.id !== action.entryId
        ),
      };
    }

    case "edit-statement-entry": {
      const entryToEdit = state.currentStatementEntries.find((entry) => entry.id === action.entryId);
      if (!entryToEdit) {
        return state;
      }

      const normalizedAmountInCents =
        action.nextType === "Transferencia"
          ? -Math.abs(action.nextAmountInCents)
          : Math.abs(action.nextAmountInCents);

      return {
        currentBalanceInCents:
          state.currentBalanceInCents - entryToEdit.amountInCents + normalizedAmountInCents,
        currentStatementEntries: state.currentStatementEntries.map((entry) =>
          entry.id === action.entryId
            ? {
              ...entry,
              type: action.nextType,
              amountInCents: normalizedAmountInCents,
              month: action.nextMonth,
              date: action.nextDate,
            }
            : entry
        ),
      };
    }

    default:
      return state;
  }
}
