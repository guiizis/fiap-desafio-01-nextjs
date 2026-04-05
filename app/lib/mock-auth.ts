export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type PublicMockUser = Omit<MockUser, "password">;

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
  };
}

function createMockToken(userId: string) {
  return `mock-token-${userId}`;
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
