import { listMockUsers, registerMockUser } from '@/app/lib/mock-auth';

type RegisterRequestBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

type ValidRegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidRegisterPayload(payload: RegisterRequestBody): payload is ValidRegisterRequestBody {
  return (
    isNonEmptyString(payload.name) &&
    isNonEmptyString(payload.email) &&
    isNonEmptyString(payload.password)
  );
}

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = (await request.json()) as RegisterRequestBody;
  } catch {
    return Response.json({ message: 'JSON invalido no corpo da requisicao.' }, { status: 400 });
  }

  if (!isValidRegisterPayload(body)) {
    return Response.json(
      { message: 'Campos obrigatorios: name, email e password.' },
      { status: 400 }
    );
  }

  const result = registerMockUser({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  if (!result.ok) {
    return Response.json(
      { message: 'Ja existe usuario cadastrado com este email.' },
      { status: 409 }
    );
  }

  return Response.json(
    {
      message: 'Usuario criado com sucesso.',
      user: result.user,
    },
    { status: 201 }
  );
}

export async function GET() {
  const users = listMockUsers();

  return Response.json({
    users,
  });
}
