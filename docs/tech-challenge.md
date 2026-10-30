# Tech Challenge — plano de evolução

Este documento relaciona os requisitos do Tech Challenge ao estado atual do Mcintosh Bank.
A estratégia é aplicar os conceitos de forma proporcional ao tamanho do projeto e manter evidências
das decisões e dos resultados.

## Matriz de requisitos

| Requisito                       | Estado inicial                                                             | Evolução planejada                                                                             | Evidência esperada                               |
| ------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Arquitetura modular             | Organização por rota e feature, ainda sem limites explícitos entre camadas | Separar apresentação, regras de domínio e acesso ao servidor dentro das features financeiras   | Estrutura do código e diagrama no README         |
| State management avançado       | Context e `useReducer` para sessão e conta                                 | Avaliar Redux Toolkit e RTK Query, mantendo estado visual local                                | Store, fluxo de eventos e Redux DevTools         |
| Clean Architecture              | Regras, persistência e UI ainda possuem pontos de acoplamento              | Extrair regras financeiras puras e centralizar comunicação HTTP, sem criar camadas artificiais | Testes do domínio independentes de React         |
| Lazy loading e pré-carregamento | Code splitting por rota fornecido pelo App Router                          | Carregar modais pesados sob demanda e revisar prefetch de rotas                                | Comparação de bundle e Lighthouse                |
| Cache                           | Sessão no `sessionStorage`; não há estratégia de cache de requisições      | Cache e invalidação de sessão/transações no cliente, respeitando dados privados                | Política documentada e comportamento verificável |
| Programação reativa             | Atualizações por hooks, contexto e reducer                                 | Fluxo orientado a eventos e atualização automática após mutações                               | Saldo e extrato reagindo às operações            |
| Autenticação segura             | Token mock previsível e sessão acessível ao JavaScript                     | Servidor Express acadêmico, sessão no servidor e cookie `HttpOnly`                             | Fluxos de login, logout e autorização            |
| Proteção de dados sensíveis     | Implementação apenas educacional                                           | Hash e salt de senha, validação no servidor e documentação das limitações                      | Código do servidor e seção de segurança          |
| Performance mensurável          | Não havia baseline versionado                                              | Lighthouse antes e depois, em condições equivalentes                                           | Relatórios em `docs/performance`                 |
| Entrega                         | README básico e testes existentes                                          | Documentação da arquitetura, segurança, performance e roteiro de demonstração                  | README final e vídeo de até cinco minutos        |

## Arquitetura proporcional

### Arquitetura inicial

```text
Navegador
  |
  +-- App Router
  |     +-- Home, login e cadastro
  |     +-- Dashboard e rotas financeiras
  |     +-- Rotas paralelas de modal
  |
  +-- Context + useReducer
  |     +-- Sessao no sessionStorage
  |     +-- Saldo e extrato em memoria
  |
  +-- Services com fetch
        +-- Route Handlers /api/mock
              +-- Usuarios mockados em memoria
```

No estado inicial, a UI e as regras estao organizadas por feature, mas sessao, estado da conta e
persistencia ainda se encontram acoplados no contexto e nos mocks. Esse e o ponto de partida para a
evolucao, sem criar camadas que o projeto ainda nao utiliza.

### Direcao da evolucao

As features financeiras deverão separar apenas responsabilidades que existem de fato:

```text
feature/
  _components/  apresentação e interação
  _domain/      tipos, cálculos e validações financeiras puras
  _services/    comunicação com o servidor Express
```

Regras para preservar os limites:

- O domínio não importa React, Next.js ou `fetch`.
- Componentes não conhecem URL, cookie ou formato de persistência.
- Serviços não contêm regras visuais.
- Estado restrito a um componente permanece local.
- Novas abstrações só são criadas quando houver uma responsabilidade ou substituição real.

## Ordem dos épicos

1. Diagnóstico, documentação e baseline de performance.
2. Separação proporcional entre apresentação, domínio e infraestrutura.
3. Estado global, reatividade e cache.
4. Servidor Express mockado e segurança de sessão.
5. Otimizações e medição final.
6. Documentação e vídeo de entrega.

### Arquitetura após o Épico 2

```text
Apresentação
  app/**/_components
        |
        +-- usa tipos e regras --> app/dashboard/_domain
        |
        +-- dispara operações --> contexto/estado atual

Domínio
  app/dashboard/_domain
        +-- transaction.types.ts
        +-- transaction-rules.ts
        +-- transaction-date-policy.ts
        +-- sem React, Next.js, fetch ou storage

Utilitários locais
  app/dashboard/_utils
        +-- date.ts
        +-- statement-date.ts
        +-- transaction-label.ts
        +-- conversão e formatação sem regra financeira

Infraestrutura
  app/home/_services
        +-- comunicação HTTP e validação das respostas
  app/api/mock
        +-- armazenamento e autenticação mock atuais
```

Foram centralizados no domínio os tipos e contratos financeiros, a normalização do sinal de
depósitos e transferências, a verificação de saldo, o saldo projetado em edições e a política que
determina o intervalo permitido para datas de transação. Tipos e implementações permanecem em
arquivos distintos.

O reducer continua em `_state` porque representa gerenciamento do estado da aplicação. Formatação
de campos, parsing e conversão de datas continuam em `_utils` por não serem regras financeiras. A comunicação HTTP
permanece em `_services`, tratada como infraestrutura da feature. Não foram adicionados
repositories, classes, injeção de dependência ou use cases sem necessidade real.

## Status

### Épico 1 — concluído

- Matriz de requisitos registrada.
- Arquitetura inicial documentada.
- Baseline Lighthouse associado ao commit inicial.
- Método de comparação antes/depois definido.
- README e instruções do repositório atualizados.
- Achados de acessibilidade do login corrigidos e validados pelo Lighthouse.

### Épico 2 — concluído

- Domínio financeiro criado em `app/dashboard/_domain`.
- Apresentação desacoplada das antigas interfaces localizadas dentro de `_components`.
- Serviços HTTP identificados como fronteira de infraestrutura.
- Reducer passou a reutilizar as regras de sinal do domínio.
- Contexto passou a reutilizar as regras de saldo e saldo projetado do domínio.
- Testes de domínio adicionados sem renderização ou DOM.
- Suíte completa aprovada com cobertura global acima de 99%.

### Épico 3 — estado global, reatividade e cache remoto concluídos

- Redux Toolkit e React-Redux adicionados seguindo o padrão oficial para App Router.
- Store criado por instância do `AppStoreProvider`, sem singleton global compartilhado.
- Provider posicionado na raiz porque home e dashboard compartilham a consulta de sessão.
- RTK Query tornou-se a fonte única dos dados remotos de sessão, saldo e extrato.
- Consultas simultâneas são deduplicadas e o cache permanece reutilizável por 60 segundos.
- Criação, edição e exclusão invalidam a conta e disparam atualização automática.
- Formulários, seleção de itens, menus e modais continuam como estado local.
- Slice local e serviços de `fetch` de transações removidos para evitar duas fontes de verdade.
- Logout limpa todo o cache remoto para não reter dados financeiros privados.
- Comparativo antes/depois e evidências automatizadas registrados em `docs/cache-baseline.md`.

### Épico 4 — backend seguro em implementação

- API Express criada fora da árvore do Next.js e encaminhada por `/backend/*` com `rewrites`.
- Senhas protegidas com `scrypt` e salt aleatório de 16 bytes.
- Sessões mantidas no servidor com cookie `HttpOnly`, `SameSite=Lax` e duração de uma hora.
- Cookie marcado como `Secure` quando `NODE_ENV=production`.
- Helmet, limite de payload e rate limit no login configurados.
- Cadastro, login, logout e consulta de sessão implementados.
- CRUD de transações protegido por sessão e autorização por usuário implementado.
- Saldo recalculado no servidor e transferências sem saldo rejeitadas.
- Usuários, hashes de senha e transações persistidos em `server/db.json` com escrita atômica.
- Cadastro e login do frontend passaram a consumir o Express por `/backend/auth/*`.
- A sessão do dashboard passou a ser validada pelo cookie `HttpOnly`, sem gravar token no
  `sessionStorage`.
- A implementação direta com `fetch` foi registrada como baseline antes da migração.
- Consulta e mutações de transações agora usam RTK Query, com invalidação automática da conta.
- Route Handlers `/api/mock`, token no `sessionStorage` e utilitários do mock antigo removidos para
  manter o Express como única fonte de autenticação e transações.

### Épico 5 — otimizações e medição final concluídos

- Modais de edição de transação e de serviço em construção separados em chunks sob demanda com
  `next/dynamic`.
- Preload por intenção adicionado em `hover`, foco por teclado e toque.
- Code splitting por rota e lazy loading de imagens mantidos sob responsabilidade das APIs nativas do
  App Router e de `next/image`.
- Seis auditorias finais executadas em build de produção, com três amostras para `/home` e três para
  `/home/login`.
- Comparativo por medianas e relatórios completos registrados em `docs/performance`.
- Medição autenticada do dashboard permanece vinculada ao Épico 4B, quando o frontend passar a usar a
  sessão por cookie do Express.
