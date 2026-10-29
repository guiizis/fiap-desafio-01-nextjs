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

## Status

### Épico 1 — concluído

- Matriz de requisitos registrada.
- Arquitetura inicial documentada.
- Baseline Lighthouse associado ao commit inicial.
- Método de comparação antes/depois definido.
- README e instruções do repositório atualizados.
- Achados de acessibilidade do login corrigidos e validados pelo Lighthouse.
