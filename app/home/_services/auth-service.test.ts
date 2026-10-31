import { afterEach, describe, expect, it, vi } from 'vitest';
import { logoutAccount, registerAccount } from './auth-service';

const user = { name: 'Maria Silva', email: 'maria@mail.com', password: 'senha-segura' };

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

    await expect(registerAccount(user)).resolves.toEqual({
      ok: true,
      message: 'Usuário criado com sucesso.',
    });
    expect(fetchMock).toHaveBeenCalledWith('/backend/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(user),
    });
  });

  it('usa mensagens fallback para resposta inválida e falha de rede', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('inválido', { status: 400 }))
      .mockRejectedValueOnce(new Error('offline'));

    await expect(registerAccount(user)).resolves.toEqual({
      ok: false,
      message: 'Não foi possível concluir a operação.',
    });
    await expect(registerAccount(user)).resolves.toEqual({
      ok: false,
      message: 'Erro de conexão. Tente novamente em instantes.',
    });
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
});
