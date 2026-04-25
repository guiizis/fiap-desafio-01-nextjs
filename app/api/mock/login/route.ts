import { loginMockUser } from '@/app/lib/mock-auth';

type LoginRequestBody = {
  email?: unknown;
  password?: unknown;
};

type ValidLoginRequestBody = {
  email: string;
  password: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidLoginPayload(payload: LoginRequestBody): payload is ValidLoginRequestBody {
  return isNonEmptyString(payload.email) && isNonEmptyString(payload.password);
}

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return Response.json({ message: 'JSON invalido no corpo da requisicao.' }, { status: 400 });
  }

  if (!isValidLoginPayload(body)) {
    return Response.json({ message: 'Campos obrigatorios: email e password.' }, { status: 400 });
  }

  const result = loginMockUser({
    email: body.email,
    password: body.password,
  });

  if (!result.ok) {
    return Response.json({ message: 'Email ou senha invalidos.' }, { status: 401 });
  }

  return Response.json({
    message: 'Login realizado com sucesso.',
    token: result.token,
    user: result.user,
  });
}
