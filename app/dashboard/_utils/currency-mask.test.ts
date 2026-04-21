import { describe, expect, it, vi } from "vitest";
import { formatCurrencyInput } from "./currency-mask";

describe("formatCurrencyInput", () => {
  it("retorna 00,00 quando nao ha digitos", () => {
    expect(formatCurrencyInput("")).toBe("00,00");
    expect(formatCurrencyInput("abc")).toBe("00,00");
  });

  it("formata valores pequenos com centavos", () => {
    expect(formatCurrencyInput("1")).toBe("0,01");
    expect(formatCurrencyInput("12")).toBe("0,12");
    expect(formatCurrencyInput("123")).toBe("1,23");
  });

  it("aplica separador de milhar e remove zeros a esquerda", () => {
    expect(formatCurrencyInput("00123456")).toBe("1.234,56");
    expect(formatCurrencyInput("1234567")).toBe("12.345,67");
  });

  it("cobre fallback do inteiro quando normalizacao resultar em vazio", () => {
    const originalReplace = String.prototype.replace;
    const replaceSpy = vi
      .spyOn(String.prototype, "replace")
      .mockImplementation(function (searchValue: RegExp | string, replaceValue: unknown) {
        if (
          this.toString() === "0" &&
          searchValue instanceof RegExp &&
          searchValue.source === "^0+(?=\\d)"
        ) {
          return "";
        }

        return originalReplace.call(this.toString(), searchValue as never, replaceValue as never);
      });

    expect(formatCurrencyInput("1")).toBe("0,01");
    replaceSpy.mockRestore();
  });
});
