import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyFromCents, sum } from "./calc";

describe("calc functions", () => {
  it("adds two numbers correctly", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("formats currency in pt-BR", () => {
    expect(formatCurrency(1234.5)).toContain("1.234,50");
  });

  it("formats currency from cents in pt-BR", () => {
    expect(formatCurrencyFromCents(250000)).toContain("2.500,00");
  });
});
