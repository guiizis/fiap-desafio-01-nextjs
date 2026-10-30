## Mcintosh Bank

O **Mcintosh Bank** é um produto fictício criado para fins educacionais, simulando uma experiência moderna de internet banking. O objetivo é proporcionar uma interface intuitiva e responsiva para gestão de contas, transações e serviços bancários digitais.

---

## Sobre o Projeto

Este repositório faz parte do **Tech Challenge** da pós-graduação em Frontend da FIAP. O desafio consiste em desenvolver uma aplicação web utilizando as melhores práticas do ecossistema React/Next.js, com foco em qualidade de código, experiência do usuário e organização de projeto.

---

## Funcionalidades

### Disponíveis

- Cadastro e login com sessão por cookie `HttpOnly`
- Visualização de resumo da conta
- Consulta de extrato bancário
- Efetuar transação
- Alterar ou excluir uma transação

### Em construção

- Serviços bancários adicionais (pagamentos, transferências, recarga, etc.)

---

## Tecnologias e Versões Utilizadas

- **Next.js**: 16.2.1
- **React**: 19
- **TypeScript**: 5
- **Tailwind CSS**: 4
- **Storybook**: 10.3.0
- **Redux Toolkit**: 2.13
- **Express**: 5.3

---

## Como rodar o projeto localmente

### 1. Pré-requisitos

- Node.js **20.19.5** ou superior (menor que 21)
- npm **10.x** (menor que 11)

### 2. Instalação das dependências

```bash
npm install
```

Copie `.env.example` para `.env` caso queira personalizar a execução. Em produção,
`SESSION_SECRET` é obrigatório e deve possuir ao menos 32 caracteres.

### 3. Rodando a aplicação Next.js

```bash
npm run dev
```

Acesse: http://localhost:3000

Para iniciar simultaneamente o Next.js e a API Express acadêmica:

```bash
npm run dev:full
```

A API utiliza a porta `3001`, persiste os dados acadêmicos em `server/db.json` e é acessada pelo
frontend através de `/backend/*`.

### 4. Rodando o Storybook

```bash
npm run storybook
```

Acesse: http://localhost:6006

### 5. Rodando os testes unitários

```bash
npm run test
```

---

## Observações

- O projeto utiliza **TypeScript** em modo estrito e segue padrões de organização e colocation recomendados para projetos Next.js modernos.
- Todos os componentes de interface são próprios, desenvolvidos internamente no projeto. A documentação e exemplos de uso desses componentes podem ser consultados no **Storybook**.
- Para detalhes sobre arquitetura, convenções e padrões, consulte o arquivo `AGENTS.md`.

---

## Evolução do Tech Challenge

- [Plano, matriz de requisitos e arquitetura proposta](docs/tech-challenge.md)
- [Baseline e metodologia de performance](docs/performance/README.md)
- [Comparativo de cache antes e depois do RTK Query](docs/cache-baseline.md)
- [Matriz final, roteiro do vídeo e checklist de entrega](docs/delivery-guide.md)

As regras financeiras ficam em `app/dashboard/_domain`, sem dependência de React ou Next.js. Os
componentes permanecem responsáveis pela apresentação, enquanto o RTK Query centraliza comunicação,
cache e invalidação da API Express. A sessão é mantida no servidor e o navegador recebe somente um
cookie `HttpOnly`.

### Como funciona o cache do RTK Query

O RTK Query armazena as respostas da API somente **em memória**, dentro da store Redux da aba atual.
Ele não utiliza `IndexedDB`, `localStorage`, `sessionStorage` ou cookies para persistir saldo, extrato
ou outros dados financeiros.

- Consultas simultâneas iguais compartilham a mesma requisição e resposta.
- Sessão e conta permanecem reutilizáveis por até 60 segundos depois que deixam de ter componentes
  inscritos (`keepUnusedDataFor`).
- Criar, editar ou excluir uma transação invalida a tag `Account` e atualiza saldo e extrato
  automaticamente.
- O logout executa `resetApiState`, removendo imediatamente do Redux todo o cache da API.
- Recarregar ou fechar a página também elimina o cache, pois não existe persistência no dispositivo.

Essa escolha reduz requisições duplicadas sem deixar informações financeiras armazenadas no navegador
após o uso da aplicação.

### Segurança do servidor acadêmico

- Senhas são derivadas com `scrypt` e salt aleatório; a senha original nunca é persistida.
- A sessão fica no servidor e o navegador recebe um cookie `HttpOnly`, `SameSite=Lax`, com duração de
  uma hora e `Secure` em produção.
- O identificador da sessão é regenerado após o login para reduzir risco de session fixation.
- Helmet adiciona headers defensivos e o endpoint de login possui rate limit de dez falhas por minuto
  e por endereço.
- Mutações com `Origin` não autorizada ou `Sec-Fetch-Site: cross-site` são rejeitadas. Clientes como
  Postman continuam aceitos quando não enviam esses headers de navegador.
- JSON inválido, payload acima de 20 KB e erros internos recebem respostas controladas, sem stack trace.
- `ALLOWED_ORIGINS` permite configurar as origens confiáveis de produção.

O `MemoryStore` do `express-session` e o arquivo `server/db.json` foram mantidos deliberadamente para
o servidor acadêmico mockado. Eles não são adequados para produção ou múltiplas instâncias; uma versão
real deveria usar armazenamento compartilhado de sessão e banco de dados com controle de concorrência,
backup e criptografia em repouso.
