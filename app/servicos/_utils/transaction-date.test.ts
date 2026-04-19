import { describe, expect, it } from "vitest";
import {
  formatIsoDateToPtBr,
  getDefaultTransactionDate,
  getTransactionDateRange,
  isTransactionDateWithinRange,
  toStatementDate,
} from "./transaction-date";

describe("transaction-date utils", () => {
  it("gera range com ano atual e ano anterior", () => {
    const range = getTransactionDateRange(new Date("2026-04-19T12:00:00.000Z"));

    expect(range.minDate).toBe("2025-01-01");
    expect(range.maxDate).toBe("2026-12-31");
  });

  it("retorna data padrao no formato ISO do input", () => {
    const value = getDefaultTransactionDate(new Date("2026-04-19T12:00:00.000Z"));

    expect(value).toBe("2026-04-19");
  });

  it("valida data apenas dentro do range permitido", () => {
    const range = { minDate: "2025-01-01", maxDate: "2026-12-31" };

    expect(isTransactionDateWithinRange("2026-04-19", range)).toBe(true);
    expect(isTransactionDateWithinRange("2024-12-31", range)).toBe(false);
    expect(isTransactionDateWithinRange("275760-04-19", range)).toBe(false);
  });

  it("converte data ISO para rótulo de extrato", () => {
    const range = { minDate: "2025-01-01", maxDate: "2026-12-31" };
    const statementDate = toStatementDate("2026-04-19", range);

    expect(statementDate).not.toBeNull();
    expect(statementDate?.dateLabel).toBe("19/04/2026");
    expect(statementDate?.monthLabel).toBe("Abril");
  });

  it("retorna null para data fora do range", () => {
    const range = { minDate: "2025-01-01", maxDate: "2026-12-31" };

    expect(toStatementDate("275760-04-19", range)).toBeNull();
  });

  it("formata data ISO para pt-BR", () => {
    expect(formatIsoDateToPtBr("2026-04-19")).toBe("19/04/2026");
  });
});

