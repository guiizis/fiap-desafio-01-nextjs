export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  accountBalanceInCents: number;
  statementEntries: MockStatementEntry[];
};

export type PublicMockUser = Omit<MockUser, "password">;

export type MockStatementEntry = {
  id: string;
  month: string;
  type: string;
  amountInCents: number;
  date: string;
};

type RegisterMockUserInput = {
  name: string;
  email: string;
  password: string;
};

type LoginMockUserInput = {
  email: string;
  password: string;
};

type RegisterMockUserResult =
  | { ok: true; user: PublicMockUser }
  | { ok: false; error: "EMAIL_ALREADY_EXISTS" };

type LoginMockUserResult =
  | { ok: true; user: PublicMockUser; token: string }
  | { ok: false; error: "INVALID_CREDENTIALS" };

type GlobalMockUsers = typeof globalThis & {
  __mockUsers?: MockUser[];
};

function getMockUsersStore() {
  const globalWithMockUsers = globalThis as GlobalMockUsers;
  globalWithMockUsers.__mockUsers ??= [];
  return globalWithMockUsers.__mockUsers;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: MockUser): PublicMockUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    accountBalanceInCents: user.accountBalanceInCents,
    statementEntries: user.statementEntries.map((entry) => ({ ...entry })),
  };
}

function createMockToken(userId: string) {
  return `mock-token-${userId}`;
}

function getDefaultStatementYear(referenceDate: Date = new Date()) {
  const yearLabel = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(referenceDate);

  return Number(yearLabel) - 1;
}

function createDefaultStatementEntries() {
  const statementYear = getDefaultStatementYear();

  return [
    {
      id: crypto.randomUUID(),
      month: "Novembro",
      type: "Deposito",
      amountInCents: 15000,
      date: `18/11/${statementYear}`,
    },
    {
      id: crypto.randomUUID(),
      month: "Novembro",
      type: "Deposito",
      amountInCents: 10000,
      date: `21/11/${statementYear}`,
    },
    {
      id: crypto.randomUUID(),
      month: "Novembro",
      type: "Deposito",
      amountInCents: 5000,
      date: `21/11/${statementYear}`,
    },
    {
      id: crypto.randomUUID(),
      month: "Novembro",
      type: "Transferencia",
      amountInCents: -50000,
      date: `21/11/${statementYear}`,
    },
  ] satisfies MockStatementEntry[];
}

export function registerMockUser({
  name,
  email,
  password,
}: RegisterMockUserInput): RegisterMockUserResult {
  const users = getMockUsersStore();
  const normalizedEmail = normalizeEmail(email);
  const alreadyExists = users.some((user) => user.email === normalizedEmail);

  if (alreadyExists) {
    return {
      ok: false,
      error: "EMAIL_ALREADY_EXISTS",
    };
  }

  const newUser: MockUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
    accountBalanceInCents: 250000,
    statementEntries: createDefaultStatementEntries(),
  };

  users.push(newUser);

  return {
    ok: true,
    user: toPublicUser(newUser),
  };
}

export function loginMockUser({
  email,
  password,
}: LoginMockUserInput): LoginMockUserResult {
  const users = getMockUsersStore();
  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (storedUser) =>
      storedUser.email === normalizedEmail && storedUser.password === password
  );

  if (!user) {
    return {
      ok: false,
      error: "INVALID_CREDENTIALS",
    };
  }

  return {
    ok: true,
    user: toPublicUser(user),
    token: createMockToken(user.id),
  };
}

export function resetMockUsersStore() {
  const users = getMockUsersStore();
  users.splice(0, users.length);
}

export function listMockUsers(): PublicMockUser[] {
  const users = getMockUsersStore();
  return users.map(toPublicUser);
}
