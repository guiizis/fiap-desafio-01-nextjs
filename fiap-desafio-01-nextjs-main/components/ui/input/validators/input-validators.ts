import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export type InputValidationKind = "none" | "name" | "email" | "password";

type ValidationConstraints = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "required" | "minLength" | "maxLength" | "pattern"
>;

type ValidationRule = {
  constraints: ValidationConstraints;
  validate: (value: string) => string | null;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/u;

function requiredRule(value: string) {
  return value.trim().length === 0 ? "Campo obrigatorio." : null;
}

const validationRules: Record<InputValidationKind, ValidationRule> = {
  none: {
    constraints: {},
    validate: () => null,
  },
  name: {
    constraints: { required: true, minLength: 3 },
    validate: (value) => {
      const requiredError = requiredRule(value);
      if (requiredError) {
        return requiredError;
      }

      const normalized = value.trim();
      if (normalized.length < 3 || !NAME_REGEX.test(normalized)) {
        return "Digite seu nome completo.";
      }

      return null;
    },
  },
  email: {
    constraints: { required: true },
    validate: (value) => {
      const requiredError = requiredRule(value);
      if (requiredError) {
        return requiredError;
      }

      return EMAIL_REGEX.test(value.trim())
        ? null
        : "Dado incorreto. Revise e digite novamente.";
    },
  },
  password: {
    constraints: { required: true, minLength: 6 },
    validate: (value) => {
      const requiredError = requiredRule(value);
      if (requiredError) {
        return requiredError;
      }

      return value.trim().length >= 6
        ? null
        : "A senha deve ter no minimo 6 caracteres.";
    },
  },
};

export function getValidationKindFromInputType(
  type?: HTMLInputTypeAttribute
): InputValidationKind {
  if (type === "email") {
    return "email";
  }

  if (type === "password") {
    return "password";
  }

  return "none";
}

export function resolveInputValidationKind({
  kind,
  type,
}: {
  kind?: InputValidationKind;
  type?: HTMLInputTypeAttribute;
}) {
  return kind ?? getValidationKindFromInputType(type);
}

export function getInputValidationConstraints(kind: InputValidationKind) {
  return validationRules[kind].constraints;
}

export function validateInputValue(kind: InputValidationKind, value: string) {
  return validationRules[kind].validate(value);
}
