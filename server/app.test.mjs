import { createRequire } from 'node:module';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { createApp, resetStore } = require('./app');

describe('Express API', () => {
  beforeEach(() => resetStore());
  afterEach(() => resetStore());

  it('protege rotas privadas sem sessao', async () => {
    const response = await request(createApp()).get('/transactions');
    expect(response.status).toBe(401);
  });

  it('aplica headers de segurança e bloqueia mutações de origem cruzada', async () => {
    const app = createApp();
    const response = await request(app).get('/inexistente');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();

    const untrustedOrigin = await request(app)
      .post('/auth/register')
      .set('Origin', 'https://site-malicioso.example')
      .send({ name: 'Ana Silva', email: 'ana@mail.com', password: 'senha-segura' });
    expect(untrustedOrigin.status).toBe(403);

    const crossSite = await request(app)
      .post('/auth/register')
      .set('Sec-Fetch-Site', 'cross-site')
      .send({ name: 'Ana Silva', email: 'ana@mail.com', password: 'senha-segura' });
    expect(crossSite.status).toBe(403);
  });

  it('cadastra, autentica por cookie e encerra a sessao', async () => {
    const agent = request.agent(createApp());
    const payload = { name: 'Ana Silva', email: 'ANA@mail.com', password: 'senha-segura' };

    expect((await agent.post('/auth/register').send(payload)).status).toBe(201);
    expect((await agent.post('/auth/register').send(payload)).status).toBe(409);
    expect(
      (await agent.post('/auth/login').send({ email: payload.email, password: 'incorreta' })).status
    ).toBe(401);

    const login = await agent
      .post('/auth/login')
      .send({ email: payload.email, password: payload.password });
    expect(login.status).toBe(200);
    expect(login.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(login.headers['set-cookie'][0]).toContain('SameSite=Lax');
    expect(login.body.user).not.toHaveProperty('passwordHash');
    expect((await agent.get('/auth/session')).status).toBe(200);
    expect((await agent.post('/auth/logout')).status).toBe(204);
    expect((await agent.get('/auth/session')).status).toBe(401);
  });

  it('valida dados de cadastro e rotas desconhecidas', async () => {
    const app = createApp();
    expect((await request(app).post('/auth/register').send({})).status).toBe(400);
    expect(
      (
        await request(app)
          .post('/auth/register')
          .set('Origin', 'http://localhost:3000')
          .send({ name: 'A'.repeat(101), email: 'ana@mail.com', password: 'senha-segura' })
      ).status
    ).toBe(400);
    expect((await request(app).get('/inexistente')).status).toBe(404);
  });

  it('limita tentativas de login por endereço', async () => {
    const app = createApp();
    const attempts = [];
    for (let index = 0; index < 11; index += 1) {
      attempts.push(
        await request(app)
          .post('/auth/login')
          .send({ email: 'inexistente@mail.com', password: 'senha-incorreta' })
      );
    }
    expect(attempts.slice(0, 10).every((response) => response.status === 401)).toBe(true);
    expect(attempts[10].status).toBe(429);
  });

  it('trata JSON inválido e payload excessivo sem expor detalhes internos', async () => {
    const app = createApp();
    const invalidJson = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send('{"name":');
    expect(invalidJson.status).toBe(400);
    expect(invalidJson.body).toEqual({ message: 'JSON inválido.' });

    const excessivePayload = await request(app)
      .post('/auth/register')
      .send({ name: 'A'.repeat(21_000), email: 'ana@mail.com', password: 'senha-segura' });
    expect(excessivePayload.status).toBe(413);
    expect(excessivePayload.body).toEqual({
      message: 'Corpo da requisição excede o limite permitido.',
    });
  });

  it('exige segredo forte e configura cookie Secure em produção', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousSecret = process.env.SESSION_SECRET;
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.SESSION_SECRET;
      expect(() => createApp()).toThrow(/SESSION_SECRET/);

      process.env.SESSION_SECRET = 'segredo-de-producao-com-mais-de-32-caracteres';
      const app = createApp();
      await request(app)
        .post('/auth/register')
        .send({ name: 'Ana Silva', email: 'ana@mail.com', password: 'senha-segura' });
      const login = await request(app)
        .post('/auth/login')
        .set('X-Forwarded-Proto', 'https')
        .send({ email: 'ana@mail.com', password: 'senha-segura' });
      expect(login.headers['set-cookie'][0]).toContain('Secure');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      if (previousSecret === undefined) delete process.env.SESSION_SECRET;
      else process.env.SESSION_SECRET = previousSecret;
    }
  });

  it('realiza CRUD autorizado e recalcula o saldo', async () => {
    const agent = request.agent(createApp());
    await agent
      .post('/auth/register')
      .send({ name: 'Ana Silva', email: 'ana@mail.com', password: 'senha-segura' });
    await agent.post('/auth/login').send({ email: 'ana@mail.com', password: 'senha-segura' });

    expect((await agent.post('/transactions').send({})).status).toBe(400);
    expect(
      (
        await agent.post('/transactions').send({
          type: 'transfer',
          amountInCents: 1,
          date: '2026-10-29',
        })
      ).status
    ).toBe(422);

    const created = await agent.post('/transactions').send({
      type: 'deposit',
      amountInCents: 10_000,
      date: '2026-10-29',
    });
    expect(created.status).toBe(201);

    const id = created.body.transaction.id;
    expect((await agent.get('/transactions')).body.balanceInCents).toBe(10_000);
    expect(
      (
        await agent
          .put('/transactions/inexistente')
          .send({ type: 'deposit', amountInCents: 1, date: '2026-10-29' })
      ).status
    ).toBe(404);
    expect((await agent.put(`/transactions/${id}`).send({})).status).toBe(400);

    const edited = await agent.put(`/transactions/${id}`).send({
      type: 'transfer',
      amountInCents: 5_000,
      date: '2026-10-29',
    });
    expect(edited.status).toBe(422);

    await agent.put(`/transactions/${id}`).send({
      type: 'deposit',
      amountInCents: 7_000,
      date: '2026-10-29',
    });
    expect((await agent.delete('/transactions/inexistente')).status).toBe(404);
    expect((await agent.delete(`/transactions/${id}`)).status).toBe(204);
    expect((await agent.get('/transactions')).body.balanceInCents).toBe(0);
  });
});
