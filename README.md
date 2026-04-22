## Mcintosh Bank

O **Mcintosh Bank** é um produto fictício criado para fins educacionais, simulando uma experiência moderna de internet banking. O objetivo é proporcionar uma interface intuitiva e responsiva para gestão de contas, transações e serviços bancários digitais.

---

## Sobre o Projeto

Este repositório faz parte do **Tech Challenge** da pós-graduação em Frontend da FIAP. O desafio consiste em desenvolver uma aplicação web utilizando as melhores práticas do ecossistema React/Next.js, com foco em qualidade de código, experiência do usuário e organização de projeto.

---

## Funcionalidades

### Disponíveis

- Cadastro e login de usuário (mock)
- Visualização de resumo da conta
- Consulta de extrato bancário
- Início de novas transações (fluxo inicial)

### Em construção

- Serviços bancários adicionais (pagamentos, transferências, recarga, etc.)
- Edição e detalhamento de lançamentos do extrato
- Funcionalidades completas de transação (finalização, confirmação, etc.)

---

## Tecnologias e Versões Utilizadas

- **Next.js**: 16.2.1
- **React**: 19
- **TypeScript**: 5
- **Tailwind CSS**: 4
- **Storybook**: 10.3.0

---

## Como rodar o projeto localmente

### 1. Pré-requisitos

- Node.js **20.19.5** ou superior (menor que 21)
- npm **10.x** (menor que 11)

### 2. Instalação das dependências

```bash
npm install
```

### 3. Rodando a aplicação Next.js

```bash
npm run dev
```

Acesse: http://localhost:3000

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
