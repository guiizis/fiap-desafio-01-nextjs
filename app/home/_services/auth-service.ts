type ServiceResponse = {
  message?: unknown;
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

async function postJson(path: string, payload?: RegisterAccountPayload) {
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

export async function logoutAccount(): Promise<ServiceResult> {
  const result = await postJson('/backend/auth/logout');
  return {
    ok: result.response?.ok === true,
    message: result.response?.ok ? 'Sessão encerrada.' : result.message,
  };
}
