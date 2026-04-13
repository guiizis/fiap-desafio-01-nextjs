import { describe, expect, it } from "vitest";
import { Logo, logoAsset, logoDimensions } from "./logo";

describe("logoDimensions", () => {
  it("usa md por padrao", () => {
    expect(logoDimensions()).toEqual({
      width: 120,
      height: 32,
    });
  });

  it("retorna dimensoes por tamanho no full", () => {
    expect(logoDimensions("sm", "full")).toEqual({
      width: 90,
      height: 24,
    });
    expect(logoDimensions("md", "full")).toEqual({
      width: 120,
      height: 32,
    });
    expect(logoDimensions("lg", "full")).toEqual({
      width: 150,
      height: 40,
    });
  });

  it("retorna dimensoes proporcionais no symbol", () => {
    expect(logoDimensions("sm", "symbol")).toEqual({
      width: 24,
      height: 24,
    });
    expect(logoDimensions("md", "symbol")).toEqual({
      width: 32,
      height: 32,
    });
    expect(logoDimensions("lg", "symbol")).toEqual({
      width: 40,
      height: 40,
    });
  });
});

describe("logoAsset", () => {
  it("usa full + light por padrao", () => {
    expect(logoAsset()).toEqual({
      src: "/logo-full.svg",
      width: 300,
      height: 80,
    });
  });

  it("retorna asset da symbol + light", () => {
    expect(logoAsset("symbol", "light")).toEqual({
      src: "/logo-symbol.svg",
      width: 48,
      height: 48,
    });
  });

  it("retorna asset da full + secondary", () => {
    expect(logoAsset("full", "secondary")).toEqual({
      src: "/logo-full-secondary.svg",
      width: 300,
      height: 80,
    });
  });
});

describe("Logo", () => {
  it("usa defaults acessiveis para header", () => {
    const element = Logo({});

    expect(element.props.src).toBe("/logo-full.svg");
    expect(element.props.alt).toBe("McIntosh Bank");
    expect(element.props.width).toBe(120);
    expect(element.props.height).toBe(32);
  });

  it("permite customizar size, alt e className", () => {
    const element = Logo({
      size: "lg",
      alt: "Marca McIntosh Bank",
      className: "shrink-0",
    });

    expect(element.props.alt).toBe("Marca McIntosh Bank");
    expect(element.props.width).toBe(150);
    expect(element.props.height).toBe(40);
    expect(element.props.className).toContain("shrink-0");
  });

  it("permite usar a variante symbol", () => {
    const element = Logo({
      variant: "symbol",
    });

    expect(element.props.src).toBe("/logo-symbol.svg");
    expect(element.props.width).toBe(32);
    expect(element.props.height).toBe(32);
  });

  it("permite usar tone secondary", () => {
    const element = Logo({
      tone: "secondary",
    });

    expect(element.props.src).toBe("/logo-full-secondary.svg");
  });
});
