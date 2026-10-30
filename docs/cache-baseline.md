# Comparativo de requisições — antes e depois do RTK Query

Esta medição compara a integração direta com `fetch` com o cache compartilhado do RTK Query. O
objetivo é comparar quantidade e finalidade das requisições, não pontuação Lighthouse.

## Política implementada

- Sessão e conta possuem uma entrada de cache compartilhada por argumento.
- Dados sem assinantes permanecem reutilizáveis por 60 segundos (`keepUnusedDataFor`).
- Consultas simultâneas idênticas são deduplicadas.
- Mutações invalidam a tag `Account` e atualizam automaticamente saldo e extrato.
- O cache completo da API é apagado no logout para não preservar dados privados.
- O cookie de sessão é enviado automaticamente pelo navegador e não pode ser lido pelo JavaScript.
- O layout do dashboard permanece montado durante a navegação entre suas páginas.
- Toda mutação bem-sucedida é seguida por uma nova consulta da conta.

## Cenários observáveis

| Cenário                                     | Antes                           | Depois                                   |
| ------------------------------------------- | ------------------------------- | ---------------------------------------- |
| Abrir a home sem sessão                     | 2 × `GET /auth/session`         | 1 × `GET /auth/session`                  |
| Abrir o dashboard autenticado               | 1 × sessão + 1 × transações     | 1 × sessão + 1 × transações              |
| Duas assinaturas simultâneas da sessão      | 2 consultas                     | 1 consulta compartilhada                 |
| Navegar entre páginas internas do dashboard | 0 com o layout montado          | 0 com o cache ativo                      |
| Criar uma transação                         | 1 × `POST` + 1 × `GET` manual   | 1 × `POST` + 1 × `GET` por invalidação   |
| Editar uma transação                        | 1 × `PUT` + 1 × `GET` manual    | 1 × `PUT` + 1 × `GET` por invalidação    |
| Excluir uma transação                       | 1 × `DELETE` + 1 × `GET` manual | 1 × `DELETE` + 1 × `GET` por invalidação |

A redução mensurável ocorre na home: header e hero continuam com hooks independentes, mas agora usam a
mesma entrada do cache. Nas mutações, a quantidade de chamadas não diminui porque a atualização do saldo
e do extrato ainda exige uma nova leitura; o ganho é remover o `refetch` manual e garantir invalidação
consistente. O teste automatizado `bank-api.test.ts` comprova a sequência mutação → invalidação → GET.

## Evidências automatizadas

- `app/home/cache-baseline.test.tsx`: duas instâncias do hook geram uma chamada.
- `app/dashboard/_state/bank-api.test.ts`: deduplicação e invalidação das três mutações.
- `app/dashboard/layout.test.tsx`: logout limpa o estado do RTK Query.
