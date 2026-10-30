const { randomBytes, randomUUID, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { readFileSync, renameSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { promisify } = require('node:util');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const scrypt = promisify(scryptCallback);
const users = new Map();
const databasePath = process.env.MCINTOSH_DB_PATH || join(__dirname, 'db.json');

function persistStore() {
  const temporaryPath = `${databasePath}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify({ users: [...users.values()] }, null, 2)}\n`);
  renameSync(temporaryPath, databasePath);
}

function loadStore() {
  try {
    const database = JSON.parse(readFileSync(databasePath, 'utf8'));
    users.clear();
    for (const user of Array.isArray(database.users) ? database.users : []) {
      users.set(user.id, user);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    persistStore();
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${Buffer.from(derivedKey).toString('hex')}`;
}

async function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':');
  if (!salt || !storedHash) return false;

  const derivedKey = Buffer.from(await scrypt(password, salt, 64));
  const storedKey = Buffer.from(storedHash, 'hex');
  return derivedKey.length === storedKey.length && timingSafeEqual(derivedKey, storedKey);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    accountBalanceInCents: user.accountBalanceInCents,
  };
}

function requireSession(req, res, next) {
  const user = req.session.userId ? users.get(req.session.userId) : null;
  if (!user) return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  req.authenticatedUser = user;
  next();
}

function signedAmount(type, amountInCents) {
  return type === 'transfer' ? -Math.abs(amountInCents) : Math.abs(amountInCents);
}

function validTransaction(body) {
  return (
    body &&
    (body.type === 'deposit' || body.type === 'transfer') &&
    Number.isInteger(body.amountInCents) &&
    body.amountInCents > 0 &&
    typeof body.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(body.date)
  );
}

function createApp() {
  loadStore();
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '20kb' }));
  app.use(
    session({
      name: 'mcintosh.sid',
      secret: process.env.SESSION_SECRET || 'development-only-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
      },
    })
  );

  const loginLimiter = rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (
      typeof name !== 'string' ||
      name.trim().length < 3 ||
      !/^\S+@\S+\.\S+$/.test(normalizedEmail) ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      return res.status(400).json({ message: 'Dados de cadastro inválidos.' });
    }
    if ([...users.values()].some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ message: 'Não foi possível criar a conta com esses dados.' });
    }

    const user = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      accountBalanceInCents: 0,
      transactions: [],
    };
    users.set(user.id, user);
    persistStore();
    return res.status(201).json({ message: 'Usuário criado com sucesso.' });
  });

  app.post('/auth/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = [...users.values()].find((candidate) => candidate.email === normalizedEmail);
    const authenticated =
      user && typeof password === 'string' && (await verifyPassword(password, user.passwordHash));
    if (!authenticated) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    req.session.userId = user.id;
    return res.json({ message: 'Login realizado com sucesso.', user: publicUser(user) });
  });

  app.post('/auth/logout', (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error);
      res.clearCookie('mcintosh.sid');
      return res.status(204).end();
    });
  });

  app.get('/auth/session', requireSession, (req, res) => {
    res.json({ user: publicUser(req.authenticatedUser) });
  });

  app.get('/transactions', requireSession, (req, res) => {
    res.json({
      balanceInCents: req.authenticatedUser.accountBalanceInCents,
      transactions: req.authenticatedUser.transactions,
    });
  });

  app.post('/transactions', requireSession, (req, res) => {
    if (!validTransaction(req.body)) {
      return res.status(400).json({ message: 'Dados da transação inválidos.' });
    }
    const amountInCents = signedAmount(req.body.type, req.body.amountInCents);
    if (req.authenticatedUser.accountBalanceInCents + amountInCents < 0) {
      return res.status(422).json({ message: 'Saldo insuficiente para concluir a transferência.' });
    }
    const transaction = { id: randomUUID(), ...req.body, amountInCents };
    req.authenticatedUser.transactions.unshift(transaction);
    req.authenticatedUser.accountBalanceInCents += amountInCents;
    persistStore();
    return res.status(201).json({ transaction });
  });

  app.put('/transactions/:id', requireSession, (req, res) => {
    if (!validTransaction(req.body)) {
      return res.status(400).json({ message: 'Dados da transação inválidos.' });
    }
    const transaction = req.authenticatedUser.transactions.find(
      (item) => item.id === req.params.id
    );
    if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });

    const nextAmount = signedAmount(req.body.type, req.body.amountInCents);
    const nextBalance =
      req.authenticatedUser.accountBalanceInCents - transaction.amountInCents + nextAmount;
    if (nextBalance < 0) {
      return res.status(422).json({ message: 'Saldo insuficiente para concluir a transferência.' });
    }
    Object.assign(transaction, req.body, { amountInCents: nextAmount });
    req.authenticatedUser.accountBalanceInCents = nextBalance;
    persistStore();
    return res.json({ transaction });
  });

  app.delete('/transactions/:id', requireSession, (req, res) => {
    const index = req.authenticatedUser.transactions.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Transação não encontrada.' });
    const [transaction] = req.authenticatedUser.transactions.splice(index, 1);
    req.authenticatedUser.accountBalanceInCents -= transaction.amountInCents;
    persistStore();
    return res.status(204).end();
  });

  app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
  app.use((_error, _req, res, _next) =>
    res.status(500).json({ message: 'Erro interno do servidor.' })
  );

  return app;
}

function resetStore() {
  users.clear();
  persistStore();
}

module.exports = { createApp, resetStore };
