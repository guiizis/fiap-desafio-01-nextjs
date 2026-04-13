import type { AuthenticatedMockUser } from "../home/_services/auth-service";

export const AUTH_SESSION_STORAGE_KEY = "mcintosh-bank:auth-session";
export const AUTH_SESSION_CHANGED_EVENT = "mcintosh-bank:auth-session-changed";

export type AuthSession = {
  token: string;
  user: AuthenticatedMockUser;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === "object";
}

function parseCurrencyStringToCents(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.round(numericValue * 100);
}

function normalizeStatementEntry(
  value: unknown
): AuthenticatedMockUser["statementEntries"][number] | null {
  if (!isRecord(value)) {
    return null;
  }

  const amountInCents =
    typeof value.amountInCents === "number"
      ? value.amountInCents
      : typeof value.value === "string"
        ? parseCurrencyStringToCents(value.value)
        : null;

  if (
    typeof value.id !== "string" ||
    typeof value.month !== "string" ||
    typeof value.type !== "string" ||
    typeof value.date !== "string" ||
    amountInCents === null
  ) {
    return null;
  }

  return {
    id: value.id,
    month: value.month,
    type: value.type,
    amountInCents,
    date: value.date,
  };
}

export function normalizeAuthSession(value: unknown): AuthSession | null {
  if (!isRecord(value) || typeof value.token !== "string" || !isRecord(value.user)) {
    return null;
  }

  const accountBalanceInCents =
    typeof value.user.accountBalanceInCents === "number"
      ? value.user.accountBalanceInCents
      : typeof value.user.accountBalance === "string"
        ? parseCurrencyStringToCents(value.user.accountBalance)
        : null;

  const rawEntries = Array.isArray(value.user.statementEntries) ? value.user.statementEntries : [];
  const statementEntries = rawEntries
    .map(normalizeStatementEntry)
    .filter((entry): entry is AuthenticatedMockUser["statementEntries"][number] => entry !== null);

  if (
    typeof value.user.id !== "string" ||
    typeof value.user.name !== "string" ||
    typeof value.user.email !== "string" ||
    typeof value.user.createdAt !== "string" ||
    accountBalanceInCents === null
  ) {
    return null;
  }

  return {
    token: value.token,
    user: {
      id: value.user.id,
      name: value.user.name,
      email: value.user.email,
      createdAt: value.user.createdAt,
      accountBalanceInCents,
      statementEntries,
    },
  };
}

export function parseAuthSession(serializedSession: string | null): AuthSession | null {
  if (!serializedSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(serializedSession) as unknown;
    return normalizeAuthSession(parsed);
  } catch {
    return null;
  }
}

function dispatchAuthSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  dispatchAuthSessionChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  dispatchAuthSessionChange();
}
