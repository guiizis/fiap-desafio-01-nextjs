# Guia de entrega do Tech Challenge

Este documento consolida as evidências do projeto e oferece um roteiro para um vídeo de até cinco
minutos. A aplicação web das fases anteriores foi escolhida para evolução; o enunciado permite evoluir
a versão web **ou** a versão mobile.

## Requisitos e evidências

| Requisito                       | Implementação                                                                                                                  | Evidência                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Arquitetura modular             | Código organizado por rota e feature, com apresentação, domínio, estado e infraestrutura separados conforme a responsabilidade | `app/dashboard/_components`, `_domain`, `_state` e `docs/tech-challenge.md` |
| Clean Architecture              | Regras financeiras puras não importam React, Next.js ou infraestrutura                                                         | `app/dashboard/_domain` e seus testes                                       |
| State Management avançado       | Redux Toolkit e RTK Query administram estado remoto; estado visual permanece local                                             | `app/dashboard/_state`                                                      |
| Cache                           | Consultas deduplicadas, retenção de 60 segundos, invalidação da conta após mutações e limpeza no logout                        | `docs/cache-baseline.md` e `bank-api.test.ts`                               |
| Programação reativa             | Saldo e extrato reagem ao cache atualizado após criação, edição ou exclusão                                                    | `auth-session-context.tsx` e testes                                         |
| Lazy loading e pré-carregamento | Modais carregados por `next/dynamic` e antecipados por hover, foco ou toque                                                    | `statement-panel.tsx` e `other-services-panel.tsx`                          |
| Performance mensurável          | Três amostras antes e depois para home e login                                                                                 | `docs/performance`                                                          |
| Autenticação segura             | Sessão no servidor e cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção                                                  | `server/app.js` e `server/app.test.mjs`                                     |
| Dados sensíveis                 | Senhas derivadas com `scrypt`, salt aleatório e comparação resistente a timing attack                                          | `server/app.js`                                                             |
| Proteções adicionais            | Helmet, rate limit, limite de payload, origem confiável e erros sanitizados                                                    | `server/app.js` e testes de segurança                                       |

## Roteiro do vídeo — aproximadamente 4min30s

### 0:00–0:25 — contexto

Mostrar a home e dizer:

> Evoluímos o Mcintosh Bank, desenvolvido em Next.js, para aplicar arquitetura modular, gerenciamento
> avançado de estado, cache, segurança e otimizações mensuráveis, preservando uma solução proporcional
> ao tamanho do projeto.

### 0:25–1:05 — arquitetura

Mostrar rapidamente `app/dashboard` no editor:

- `_components`: apresentação e interação;
- `_domain`: tipos e regras financeiras puras;
- `_state`: Redux Toolkit e RTK Query;
- `server`: autenticação, autorização e persistência acadêmica.

Destacar que o domínio não depende de React, Next.js, `fetch` ou banco de dados.

### 1:05–1:55 — fluxo funcional

Na aplicação:

1. cadastrar ou entrar em uma conta;
2. criar uma transação;
3. editar a transação;
4. excluir a transação;
5. mostrar saldo e extrato reagindo às operações;
6. encerrar a sessão.

### 1:55–2:40 — Redux e cache

Mostrar `bank-api.ts` e explicar:

- respostas remotas ficam somente na memória da store;
- duas consultas idênticas compartilham uma requisição;
- mutações invalidam a tag `Account` e atualizam saldo e extrato;
- o logout executa `resetApiState`;
- nenhum dado financeiro é persistido em `localStorage` ou IndexedDB.

Mostrar a tabela antes/depois de `docs/cache-baseline.md`.

### 2:40–3:25 — segurança

Mostrar `server/app.js` e resumir:

- senha protegida com `scrypt` e salt;
- sessão no servidor com cookie inacessível ao JavaScript;
- regeneração do ID no login;
- Helmet, rate limit e limite de payload;
- validação de origem nas mutações;
- segredo forte e cookie `Secure` em produção.

Explicar honestamente que `MemoryStore` e `db.json` são escolhas acadêmicas e seriam substituídos em
produção.

### 3:25–4:10 — performance

Mostrar `docs/performance/README.md`:

- baseline versionada antes das alterações;
- modais separados em chunks com lazy loading;
- preload por intenção;
- comparação pela mediana de três execuções;
- home: performance de 95 para 96 e LCP de 2864 ms para 2720 ms;
- login: acessibilidade de 92 para 100.

### 4:10–4:30 — qualidade e encerramento

Mostrar o terminal com os comandos finais e dizer:

> A entrega foi validada com lint, build de produção e testes automatizados com cobertura global acima
> de 99%. Assim, atendemos aos requisitos com evidências reproduzíveis no repositório.

## Checklist antes de enviar

- [ ] Executar `npm install` em um clone ou diretório limpo.
- [ ] Executar `npm run dev:full` e realizar o fluxo manual completo.
- [ ] Executar `npm run lint`, `npm run test` e `npm run build`.
- [ ] Confirmar que `server/db.json` não contém usuário de demonstração indesejado.
- [ ] Confirmar que `.env` e segredos não foram versionados.
- [ ] Gravar o vídeo em até cinco minutos seguindo o roteiro.
- [ ] Adicionar o link do vídeo à entrega ou ao README, conforme solicitado pela plataforma.
- [ ] Conferir se o repositório e o vídeo estão acessíveis aos avaliadores.

## Limitações assumidas

- `express-session` usa `MemoryStore`, adequado apenas para a demonstração acadêmica.
- `server/db.json` não substitui um banco de dados transacional.
- O cache do RTK Query é volátil e isolado por aba.
- Serviços bancários adicionais permanecem demonstrativos.
- A gravação do vídeo e o teste manual final dependem do ambiente de quem fará a entrega.
