# AGENTS.md

## Projeto
- Aplicacao: `mcintosh-bank`
- Stack atual: Next.js `16.2.1`, React `19`, TypeScript strict, App Router, Tailwind CSS `4`
- Estado atual: projeto ainda proximo do scaffold do `create-next-app`; prefira evolucoes incrementais e evite criar arquitetura complexa cedo demais

## Regra principal de Next.js 16
- Este projeto usa uma versao do Next.js com mudancas importantes em APIs, convencoes e estrutura
- Antes de alterar comportamento de roteamento, cache, rendering, data fetching, proxy/middleware, imagens, metadata, Route Handlers, Server Actions ou configuracoes do Next, leia o documento relevante em `node_modules/next/dist/docs/`
- Em caso de conflito entre conhecimento previo e os docs locais do projeto, siga os docs locais

## Convencoes da aplicacao
- Use App Router e mantenha codigo novo dentro de `app/`
- Server Components sao o padrao; use `"use client"` apenas quando precisar de interatividade, hooks de cliente ou APIs do navegador
- Prefira componentes, utilitarios e funcoes simples antes de introduzir camadas extras
- Preserve a estrutura existente e organize novas features por pasta, sem espalhar arquivos desnecessariamente
- Se criar texto de interface e o pedido nao disser o contrario, prefira conteudo em `pt-BR`
- Testes unitarios (Vitest) devem focar em logica e funcoes, sem cobrir UI e dom; UI deve ser E2E (Cypress, Playwright, etc.)

## Dados, mutacoes e cache
- Para mutacoes e formularios, prefira Server Actions quando isso simplificar o fluxo
- Nao use `use cache`, `cacheLife`, `cacheTag`, `updateTag` ou configs de `cacheComponents` por padrao; use apenas quando houver necessidade clara e apos consultar os docs relevantes
- Lembre que convencoes antigas de cache e PPR podem nao valer nesta versao do Next

## Proxy e borda
- No Next 16, prefira `proxy.ts` em novos fluxos de proxy
- Se existir necessidade real de Edge Runtime, releia os docs antes de trocar `proxy` por `middleware`, porque o comportamento mudou

## Estrutura
- Nao use pasta `src`
- Use App Router diretamente em `app/`
- Prefira estrutura por feature e por rota, com colocation: componentes locais, hooks, utils e estilos devem ficar perto da rota que usa aquilo
- Mantenha em pastas globais apenas o que for realmente compartilhado: `components/ui`, `lib` e `styles`

## Processo para componente global de UI
- Crie componente global apenas quando houver reuso real em mais de uma rota/feature
- Estrutura padrao em `components/ui/<nome-do-componente>/`
- Padrao de arquivos:
  - `<nome-do-componente>.tsx`
  - `index.ts`
  - `interfaces/<nome-do-componente>.interfaces.ts`
  - `<nome-do-componente>.test.tsx`
  - `<nome-do-componente>.stories.tsx`
- Centralize `types` e `interfaces` no arquivo `interfaces/*.interfaces.ts`
- API publica do componente deve ser simples e previsivel, com defaults consistentes com a semantica do design system
- Quando houver variacao visual, prefira separar conceito de estrutura (`variant`) de tema (`tone`)
- Padrao atual do `Button` global:
  - `variant`: `solid | outline | ghost`
  - `tone`: `primary | secondary | accent | error`
  - defaults: `variant="solid"` e `tone="primary"`
- Nao criar tamanhos, espacamentos, raios ou cores fora da escala de tokens; use classes baseadas em `styles/tokens.css`
- Evite hardcode de valores numericos de UI quando ja existir token equivalente
- Adicione teste unitario do componente focando na logica (ex: classes geradas e defaults), sem depender de teste de UI complexo em DOM
- Se o componente estiver fora de `app/**`, garantir que ele entra em `coverage.include` do Vitest quando necessario
- Adicione Storybook do componente com:
  - `Playground` com controles
  - casos canonicos usados no produto (ex: combinacoes principais de variant/tone)
- Se criar stories em `components/**`, garantir que `.storybook/main.ts` inclui esse path

## Design e estilos
- Respeite os tokens visuais centralizados em `styles/tokens.css`
- Importe os tokens apenas via `app/globals.css`
- O foco atual e configurar a base visual; nao sair gerando componentes de UI sem necessidade explicita
- Nao hardcode cores, raios ou superficies se ja existir token para isso

## Estilo de codigo
- TypeScript estrito e obrigatorio; nao contorne tipos sem necessidade
- Prefira APIs nativas do Next e React antes de adicionar dependencias
- Em componentes React, mantenha props e estados enxutos e com nomes claros
- Evite mover logica para Client Components sem necessidade, para nao aumentar bundle no cliente

## UI e experiencia
- Preserve responsividade mobile e desktop
- Trate loading, empty state e error state quando a feature justificar
- Em fluxos financeiros, priorize clareza de texto, feedback de acao e acessibilidade basica

## Qualidade e validacao
- Antes de concluir mudancas de codigo, rode `npm run lint`
- Quando a alteracao puder impactar build, roteamento, tipos do App Router ou configuracao, rode tambem `npm run build`
- Hoje o repositorio nao possui setup de testes automatizados; se adicionar testes, prefira colocacao proxima da feature ou em `__tests__/`
- Para componentes assincronos do App Router, considere E2E quando teste unitario nao cobrir bem o comportamento

## O que evitar
- Nao assumir APIs antigas do Next sem verificar a documentacao local
- Nao introduzir abstracoes, pastas globais ou hooks reutilizaveis sem uso real
- Nao transformar tudo em Client Component
- Nao adicionar bibliotecas para resolver problemas que o Next, React ou CSS atual ja cobrem
