type ServiceResponse = {
  message?: unknown;
  user?: unknown;
};

type ServiceResult = {
  ok: boolean;
  message: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  accountBalanceInCents: number;
};

type RegisterAccountPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginAccountPayload = {
  email: string;
  password: string;
};

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;

  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.createdAt === 'string' &&
    typeof user.accountBalanceInCents === 'number'
  );
}

async function postJson(path: string, payload?: RegisterAccountPayload | LoginAccountPayload) {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: payload ? { 'content-type': 'application/json' } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const body = (await response.json().catch(() => null)) as ServiceResponse | null;

    return {
      response,
      body,
      message:
        typeof body?.message === 'string' && body.message.trim()
          ? body.message
          : response.ok
            ? 'Operação realizada com sucesso.'
            : 'Não foi possível concluir a operação.',
    };
  } catch {
    return {
      response: null,
      body: null,
      message: 'Erro de conexão. Tente novamente em instantes.',
    };
  }
}

export async function registerAccount(payload: RegisterAccountPayload): Promise<ServiceResult> {
  const result = await postJson('/backend/auth/register', payload);
  return { ok: result.response?.ok === true, message: result.message };
}

export async function loginAccount(payload: LoginAccountPayload) {
  const result = await postJson('/backend/auth/login', payload);

  if (result.response?.ok && isAuthenticatedUser(result.body?.user)) {
    return { ok: true as const, message: result.message, user: result.body.user };
  }

  return { ok: false as const, message: result.message };
}

export async function logoutAccount(): Promise<ServiceResult> {
  const result = await postJson('/backend/auth/logout');
  return {
    ok: result.response?.ok === true,
    message: result.response?.ok ? 'Sessão encerrada.' : result.message,
  };
}

export async function getAuthSession() {
  try {
    const response = await fetch('/backend/auth/session', { cache: 'no-store' });
    const body = (await response.json().catch(() => null)) as ServiceResponse | null;

    if (response.ok && isAuthenticatedUser(body?.user)) {
      return { ok: true as const, user: body.user };
    }

    return { ok: false as const };
  } catch {
    return { ok: false as const };
  }
}
