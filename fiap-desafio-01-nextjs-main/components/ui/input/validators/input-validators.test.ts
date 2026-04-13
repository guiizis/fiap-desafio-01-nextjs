import { describe, expect, it } from "vitest";
import {
  getInputValidationConstraints,
  getValidationKindFromInputType,
  resolveInputValidationKind,
  validateInputValue,
} from "./input-validators";

describe("input validators", () => {
  it("resolve validation kind from input type", () => {
    expect(getValidationKindFromInputType("email")).toBe("email");
    expect(getValidationKindFromInputType("password")).toBe("password");
    expect(getValidationKindFromInputType("text")).toBe("none");
  });

  it("gives precedence to explicit kind", () => {
    expect(resolveInputValidationKind({ kind: "name", type: "text" })).toBe("name");
    expect(resolveInputValidationKind({ type: "email" })).toBe("email");
  });

  it("returns default constraints by kind", () => {
    expect(getInputValidationConstraints("none")).toEqual({});
    expect(getInputValidationConstraints("name")).toMatchObject({ required: true, minLength: 3 });
    expect(getInputValidationConstraints("password")).toMatchObject({
      required: true,
      minLength: 6,
    });
  });

  it("validates email values with expected messages", () => {
    expect(validateInputValue("email", "")).toBe("Campo obrigatorio.");
    expect(validateInputValue("email", "email-invalido")).toBe(
      "Dado incorreto. Revise e digite novamente."
    );
    expect(validateInputValue("email", "user@mail.com")).toBeNull();
    expect(validateInputValue("none", "qualquer valor")).toBeNull();
  });

  it("validates name and password values", () => {
    expect(validateInputValue("name", "")).toBe("Campo obrigatorio.");
    expect(validateInputValue("name", "ab")).toBe("Digite seu nome completo.");
    expect(validateInputValue("name", "Maria Silva")).toBeNull();

    expect(validateInputValue("password", "")).toBe("Campo obrigatorio.");
    expect(validateInputValue("password", "123")).toBe(
      "A senha deve ter no minimo 6 caracteres."
    );
    expect(validateInputValue("password", "123456")).toBeNull();
  });
});
