import { createRequire } from 'node:module';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { createApp, resetStore } = require('./app');

describe('Express API', () => {
  beforeEach(() => resetStore());

  it('protege rotas privadas sem sessao', async () => {
    const response = await request(createApp()).get('/transactions');
    expect(response.status).toBe(401);
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
    expect(login.body.user).not.toHaveProperty('passwordHash');
    expect((await agent.get('/auth/session')).status).toBe(200);
    expect((await agent.post('/auth/logout')).status).toBe(204);
    expect((await agent.get('/auth/session')).status).toBe(401);
  });

  it('valida dados de cadastro e rotas desconhecidas', async () => {
    const app = createApp();
    expect((await request(app).post('/auth/register').send({})).status).toBe(400);
    expect((await request(app).get('/inexistente')).status).toBe(404);
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
