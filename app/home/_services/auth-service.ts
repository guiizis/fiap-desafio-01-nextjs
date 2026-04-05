type ServiceMessageResponse = {
  message?: unknown;
};

type ServiceResult = {
  ok: boolean;
  message: string;
};

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
): Promise<ServiceResult> {
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
    };
  } catch {
    return {
      ok: false,
      message: "Erro de conexao. Tente novamente em instantes.",
    };
  }
}

export async function registerMockAccount(payload: RegisterMockAccountPayload) {
  return postJson("/api/mock/users", payload, {
    fallbackSuccessMessage: "Usuario criado com sucesso.",
    fallbackErrorMessage: "Nao foi possivel criar a conta. Tente novamente.",
  });
}

export async function loginMockAccount(payload: LoginMockAccountPayload) {
  return postJson("/api/mock/login", payload, {
    fallbackSuccessMessage: "Login realizado com sucesso.",
    fallbackErrorMessage: "Nao foi possivel autenticar. Revise seus dados.",
  });
}
