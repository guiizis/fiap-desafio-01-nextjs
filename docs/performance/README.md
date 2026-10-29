# Baseline de performance

## Objetivo

Preservar uma medição anterior às mudanças de arquitetura, backend e otimização para permitir uma
comparação legítima com a entrega final.

## Ambiente da medição inicial

- Data: 29/10/2026
- Commit da aplicação: `e67593c7f3154c6f4ead5ab0a1b16fc474795d30`
- Branch: `main`
- Next.js: `16.2.1`
- Node.js utilizado: `20.19.4`
- Navegador: Google Chrome instalado localmente
- Execução: build de produção servido por `next start`
- Perfil Lighthouse: mobile padrão
- Amostra: três execuções por rota; resultado consolidado pela mediana

> O Node.js utilizado está um patch abaixo do mínimo `20.19.5` declarado pelo projeto. A comparação
> final deve usar a mesma versão ou registrar explicitamente a nova versão.

## Resultado inicial

| Rota          | Performance | Acessibilidade | Boas práticas | SEO |    FCP |      LCP |   TBT |   CLS | Transferência |
| ------------- | ----------: | -------------: | ------------: | --: | -----: | -------: | ----: | ----: | ------------: |
| `/home`       |          95 |            100 |           100 | 100 | 762 ms | 2.864 ms | 38 ms | 0,021 |        299 KB |
| `/home/login` |          95 |             92 |           100 | 100 | 762 ms | 2.921 ms | 40 ms | 0,021 |        305 KB |

Os valores são as medianas de cada métrica nas três execuções. Os arquivos JSON preservam todos os
detalhes das auditorias e o primeiro relatório da home também está disponível em HTML.

## Achados iniciais

- O LCP é a principal métrica com espaço para melhoria nas duas rotas públicas.
- A tela de login possui um diálogo sem nome acessível.
- A tela de login possui pelo menos uma combinação de cores com contraste insuficiente.
- O dashboard autenticado não foi incluído nesta primeira captura porque o Lighthouse usa um perfil
  limpo e a implementação inicial depende de sessão no `sessionStorage`.
- Uma baseline autenticada deve ser criada antes das otimizações do Épico 5, após a sessão por cookie
  permitir uma preparação reproduzível do usuário de teste.

## Validação de acessibilidade do Épico 1

As duas falhas encontradas no login foram corrigidas sem alterar os relatórios do baseline:

- o diálogo agora recebe um nome acessível explícito;
- o link de recuperação de senha usa uma cor com contraste suficiente.

Uma auditoria de confirmação elevou a acessibilidade de `/home/login` de 92 para 100. Os testes
`aria-dialog-name` e `color-contrast` passaram individualmente. O relatório está preservado em
`docs/performance/validation/epic-1-login.json` e não representa a medição final de performance.

## Procedimento para a comparação final

1. Usar build de produção, nunca o servidor de desenvolvimento.
2. Manter o mesmo perfil mobile e a mesma máquina sempre que possível.
3. Medir as mesmas rotas três vezes.
4. Descartar apenas execuções que apresentem erro comprovado, registrando o motivo.
5. Comparar medianas e não o melhor resultado.
6. Guardar os relatórios finais em `docs/performance/after/`.
7. Registrar commit, versões, navegador e data da nova medição.

Além da comparação geral entre o projeto inicial e a entrega, o Épico 5 deverá produzir uma segunda
comparação isolando especificamente as otimizações de performance.
