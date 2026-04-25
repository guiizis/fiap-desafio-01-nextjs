import { describe, expect, it, vi } from "vitest";
import {
  formatIsoDateToPtBr,
  getDefaultTransactionDate,
  getTransactionDateRange,
  getTimestampFromPtBrDate,
  getYearFromPtBrDate,
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

  it("usa fallback de partes quando formatToParts nao traz ano, mes e dia", () => {
    const formatterMock = {
      format: () => "2026",
      formatToParts: () => [],
      resolvedOptions: () => ({ locale: "en-CA" }),
    } as unknown as Intl.DateTimeFormat;
    const dateTimeFormatSpy = vi
      .spyOn(Intl, "DateTimeFormat")
      .mockImplementation(() => formatterMock);

    try {
      const value = getDefaultTransactionDate(new Date("2026-04-19T12:00:00.000Z"));
      expect(value).toBe("1970-01-01");
    } finally {
      dateTimeFormatSpy.mockRestore();
    }
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

  it("retorna null para data invalida no calendario", () => {
    const range = { minDate: "2025-01-01", maxDate: "2026-12-31" };

    expect(toStatementDate("2026-02-31", range)).toBeNull();
  });

  it("formata data ISO para pt-BR", () => {
    expect(formatIsoDateToPtBr("2026-04-19")).toBe("19/04/2026");
  });

  it("mantem valor original quando data ISO e invalida", () => {
    expect(formatIsoDateToPtBr("2026-02-31")).toBe("2026-02-31");
  });

  it("extrai ano de data pt-BR valida e retorna null para valor invalido", () => {
    expect(getYearFromPtBrDate("19/04/2026")).toBe(2026);
    expect(getYearFromPtBrDate("31/02/2026")).toBeNull();
    expect(getYearFromPtBrDate("2026-04-19")).toBeNull();
  });

  it("converte data pt-BR para timestamp UTC e retorna null quando invalida", () => {
    expect(getTimestampFromPtBrDate("19/04/2026")).toBe(Date.UTC(2026, 3, 19, 12));
    expect(getTimestampFromPtBrDate("31/02/2026")).toBeNull();
  });
});
