type ServiceMessageResponse = {
  message?: unknown;
  token?: unknown;
  user?: unknown;
};

type ServiceResult = {
  ok: boolean;
  message: string;
};

export type AuthStatementEntry = {
  id: string;
  month: string;
  type: string;
  amountInCents: number;
  date: string;
};

export type AuthenticatedMockUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  accountBalanceInCents: number;
  statementEntries: AuthStatementEntry[];
};

export type LoginMockAccountResult =
  | (ServiceResult & { ok: true; token: string; user: AuthenticatedMockUser })
  | (ServiceResult & { ok: false });

type RegisterMockAccountPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginMockAccountPayload = {
  email: string;
  password: string;
};

type PostJsonOptions = {
  fallbackSuccessMessage: string;
  fallbackErrorMessage: string;
};

function resolveMessage({
  response,
  body,
  fallbackSuccessMessage,
  fallbackErrorMessage,
}: {
  response: Response;
  body: ServiceMessageResponse | null;
  fallbackSuccessMessage: string;
  fallbackErrorMessage: string;
}) {
  const fallbackMessage = response.ok ? fallbackSuccessMessage : fallbackErrorMessage;

  if (typeof body?.message === "string" && body.message.trim().length > 0) {
    return body.message;
  }

  return fallbackMessage;
}

async function postJson(
  path: string,
  payload: RegisterMockAccountPayload | LoginMockAccountPayload,
  { fallbackSuccessMessage, fallbackErrorMessage }: PostJsonOptions
): Promise<ServiceResult & { body: ServiceMessageResponse | null }> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json().catch(() => null)) as ServiceMessageResponse | null;

    return {
      ok: response.ok,
      message: resolveMessage({
        response,
        body,
        fallbackSuccessMessage,
        fallbackErrorMessage,
      }),
      body,
    };
  } catch {
    return {
      ok: false,
      message: "Erro de conexao. Tente novamente em instantes.",
      body: null,
    };
  }
}

function isStatementEntry(value: unknown): value is AuthStatementEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.month === "string" &&
    typeof entry.type === "string" &&
    typeof entry.amountInCents === "number" &&
    typeof entry.date === "string"
  );
}

function isAuthenticatedMockUser(value: unknown): value is AuthenticatedMockUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.accountBalanceInCents === "number" &&
    Array.isArray(user.statementEntries) &&
    user.statementEntries.every(isStatementEntry)
  );
}

export async function registerMockAccount(payload: RegisterMockAccountPayload) {
  const result = await postJson("/api/mock/users", payload, {
    fallbackSuccessMessage: "Usuario criado com sucesso.",
    fallbackErrorMessage: "Nao foi possivel criar a conta. Tente novamente.",
  });

  return {
    ok: result.ok,
    message: result.message,
  };
}

export async function loginMockAccount(payload: LoginMockAccountPayload) {
  const result = await postJson("/api/mock/login", payload, {
    fallbackSuccessMessage: "Login realizado com sucesso.",
    fallbackErrorMessage: "Nao foi possivel autenticar. Revise seus dados.",
  });

  if (
    result.ok &&
    typeof result.body?.token === "string" &&
    isAuthenticatedMockUser(result.body.user)
  ) {
    return {
      ok: true as const,
      message: result.message,
      token: result.body.token,
      user: result.body.user,
    };
  }

  return {
    ok: false as const,
    message: result.message,
  };
}
