import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuthSession, loginAccount, logoutAccount, registerAccount } from './auth-service';

const user = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@mail.com',
  createdAt: '2026-10-29T10:00:00.000Z',
  accountBalanceInCents: 0,
};

function response(body: unknown, init: ResponseInit = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('auth-service', () => {
  afterEach(() => vi.restoreAllMocks());

  it('cadastra pelo backend e preserva a mensagem do servidor', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ message: 'Usuário criado com sucesso.' }, { status: 201 }));

    await expect(
      registerAccount({ name: user.name, email: user.email, password: 'senha-segura' })
    ).resolves.toEqual({ ok: true, message: 'Usuário criado com sucesso.' });
    expect(fetchMock).toHaveBeenCalledWith('/backend/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: user.name, email: user.email, password: 'senha-segura' }),
    });
  });

  it('usa mensagens fallback em respostas sem JSON válido', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('inválido', { status: 201 }))
      .mockResolvedValueOnce(new Response(null, { status: 400 }));

    await expect(
      registerAccount({ name: user.name, email: user.email, password: 'senha-segura' })
    ).resolves.toEqual({ ok: true, message: 'Operação realizada com sucesso.' });
    await expect(
      registerAccount({ name: user.name, email: user.email, password: 'senha-segura' })
    ).resolves.toEqual({ ok: false, message: 'Não foi possível concluir a operação.' });
  });

  it('autentica somente quando o usuário retornado possui o contrato esperado', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response({ message: 'Login realizado.', user }))
      .mockResolvedValueOnce(response({ message: 'Payload inválido.', user: { id: 1 } }));

    await expect(loginAccount({ email: user.email, password: 'senha-segura' })).resolves.toEqual({
      ok: true,
      message: 'Login realizado.',
      user,
    });
    await expect(loginAccount({ email: user.email, password: 'senha-segura' })).resolves.toEqual({
      ok: false,
      message: 'Payload inválido.',
    });
  });

  it('trata falha de rede no cadastro e no login', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const expected = { ok: false, message: 'Erro de conexão. Tente novamente em instantes.' };

    await expect(
      registerAccount({ name: user.name, email: user.email, password: 'senha-segura' })
    ).resolves.toEqual(expected);
    await expect(loginAccount({ email: user.email, password: 'senha-segura' })).resolves.toEqual(
      expected
    );
  });

  it('encerra a sessão sem enviar payload', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    await expect(logoutAccount()).resolves.toEqual({ ok: true, message: 'Sessão encerrada.' });
    expect(fetchMock).toHaveBeenCalledWith('/backend/auth/logout', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('retorna erro do servidor ao encerrar a sessão', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      response({ message: 'Não foi possível sair.' }, { status: 500 })
    );
    await expect(logoutAccount()).resolves.toEqual({
      ok: false,
      message: 'Não foi possível sair.',
    });
  });

  it('consulta a sessão com no-store e valida o usuário', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ user }));
    await expect(getAuthSession()).resolves.toEqual({ ok: true, user });
    expect(fetchMock).toHaveBeenCalledWith('/backend/auth/session', { cache: 'no-store' });

    fetchMock.mockResolvedValue(response({ user: null }, { status: 401 }));
    await expect(getAuthSession()).resolves.toEqual({ ok: false });
  });

  it('considera a sessão ausente quando a consulta falha', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    await expect(getAuthSession()).resolves.toEqual({ ok: false });
  });
});
