# Arquitetura de estilos

**Versão:** 1.8.8
**Entrada única:** `src/styles/index.css`
**Escopo:** conclusão da Etapa 7 de modularização física do CSS

## 1. Objetivo

O CSS do Site JD era mantido em um arquivo global extenso. A Etapa 7 separou esse conteúdo em módulos com responsabilidades identificáveis sem alterar propriedades, seletores, valores, especificidade ou ordem da cascata.

O resultado compilado permanece equivalente ao baseline:

- asset `index-BBMVsMFR.css`;
- 148.604 bytes minificados;
- 27.491 bytes gzip na medição canônica;
- SHA-256 `3cbe75fdad43a99e1d5c43779b55b779d37140b2ff014ffe8f41a4c07573ba81`;
- 1.413 regras;
- 1.618 seletores;
- 14 media queries;
- 8 keyframes;
- 12 declarações `!important`.

## 2. Arquitetura anterior

Antes da Etapa 7, fontes, tokens, estilos públicos, painel, temas, previews, classificações e responsividade eram concatenados em `global.css`. A ordem funcionava, porém o arquivo misturava responsabilidades e tornava alterações localizadas difíceis de revisar.

## 3. Princípio da reorganização

Os cortes foram feitos por blocos físicos contíguos. A prioridade foi reproduzir a sequência anterior, não criar uma ordem conceitualmente ideal. Quando um domínio aparecia em posições diferentes, ele permaneceu dividido em mais de um módulo.

Nenhuma propriedade foi alterada, nenhum seletor foi removido, nenhuma duplicação foi limpa e nenhuma fonte foi otimizada.

## 4. Ponto de entrada

`src/main.jsx` importa apenas `src/styles/index.css`. Componentes React não importam CSS diretamente.

O `index.css` contém:

1. import remoto das fontes;
2. tokens;
3. classificações fundacionais;
4. base;
5. módulos públicos e modais na sequência histórica;
6. módulos administrativos iniciais;
7. animações;
8. responsividade principal;
9. reduced motion inicial;
10. appearance e designs;
11. previews tardios;
12. classificações tardias;
13. mensagens e sincronização;
14. foco global;
15. reduced motion final.

Não são usados `@layer`, CSS Modules, nesting, lazy CSS ou imports em componentes.

## 5. Tokens

`tokens.css` mantém o único bloco `:root` canônico. Ele contém somente variáveis de cor, superfície, tipografia, raio, sombra e gradiente. Não contém seletores de componentes, media queries ou classificações.

## 6. Classificações fundacionais

`themes/classifications-foundation.css` permanece próximo ao início da cascata porque suas quatro media queries e regras básicas já ocupavam essa posição antes do reset. Ele não foi consolidado com as gerações tardias.

## 7. Base

`base.css` contém reset, elementos globais e fundamentos do documento. Regras compartilhadas que originalmente apareciam depois continuam em seus módulos físicos posteriores.

## 8. Módulos públicos

Os estilos públicos estão em `public/`:

- `site-intro.css`;
- `specialties.css`;
- `projects.css`;
- `site-content.css`;
- `site-closing.css`;
- `project-detail.css`.

O domínio público foi dividido porque seus blocos eram intercalados por modais e outras regras.

## 9. Modais

Os modais permanecem em posições distintas:

- `components/specialties-modal.css`;
- `components/contact-modal.css`;
- `components/portfolio-guide-modal.css`;
- `components/project-modal.css`.

Eles não foram reunidos em um único arquivo para evitar mudança de cascata.

## 10. Módulos administrativos

Os blocos iniciais do painel estão em `admin/`:

- `core.css`: painel, login, campos e erros;
- `legacy.css`: estruturas históricas preservadas;
- `shell.css`: console, navegação, cabeçalho e métricas;
- `views.css`: overview e estados das views;
- `projects.css`: repositórios, editor e modelos;
- `library.css`: biblioteca e figurinhas;
- `guide.css`: guia administrativo;
- `messages-late.css`: mensagens, loading, sincronização e `admin-spin` na posição tardia original.

## 11. Animações

`animations.css` contém os sete keyframes que iniciavam o antigo bloco tardio. O oitavo keyframe, `admin-spin`, permanece em `admin/messages-late.css`, pois antecipá-lo mudaria sua posição física.

## 12. Responsividade

`responsive/main.css` preserva, na ordem original, os breakpoints de 980 px, 760 px e 430 px, incluindo regras públicas e administrativas misturadas.

Os blocos de movimento reduzido continuam separados:

- `responsive/reduced-motion-early.css` na posição histórica intermediária;
- `responsive/reduced-motion-final.css` como último bloco efetivo da cascata.

Breakpoints não foram consolidados, renomeados ou convertidos para mobile-first.

## 13. Appearance e designs

`themes/appearance.css` preserva:

- todos os designs existentes;
- esquemas claro e escuro;
- raios e sombras;
- combinações tipográficas;
- hardcodes de Manrope, Georgia e Courier New;
- UI administrativa de aparência;
- editor profissional;
- previews compactos de modelos.

O arquivo representa um bloco contínuo real; por isso contém tanto regras aplicadas ao `html` quanto UI administrativa relacionada.

## 14. Fontes

O import remoto continua no topo do `index.css`. As famílias e pesos não foram reduzidos nesta etapa. A otimização das fontes é uma atividade futura separada porque pode alterar carregamento e visual.

## 15. Previews administrativos

`themes/admin-previews.css` contém os previews tardios de aparência, projetos, modelos e submodais. Ele permanece depois de appearance, como no CSS original.

## 16. Classificações tardias

As gerações tardias foram preservadas separadamente:

- `themes/classifications-preview.css`;
- `themes/classifications-structures.css`;
- `themes/classifications-late.css`.

Elas mantêm landing page, institucional, profissional autônomo, negócio local, catálogo e classificações legadas. Essa modularização não publica templates futuros; a política pública continua permitindo somente `portfolio-app`.

## 17. Mensagens e sincronização

`admin/messages-late.css` mantém caixa de entrada, filtros, estados, loading de rota, saving, saved, pending, error e a animação de sincronização. A media query local de 680 px permanece no mesmo bloco.

## 18. Foco

`status/focus.css` contém o seletor global `:focus-visible`. Ele permanece entre sincronização e reduced motion final, reproduzindo a posição anterior.

## 19. Reduced motion

O último import é `responsive/reduced-motion-final.css`. Suas durações, transições e usos de `!important` permanecem intactos. O bloco não foi consolidado com o reduced motion inicial.

## 20. Situação do global.css

Todo o conteúdo foi mapeado sem lacunas. `global.css` ficou sem conteúdo residual e foi removido do repositório e do `index.css`. O ponto único continua sendo `index.css`.

## 21. Dependências de posição

- classificações fundacionais devem permanecer antes de `base.css`;
- modais devem permanecer entre seus blocos públicos históricos;
- módulos administrativos iniciais devem permanecer antes das animações;
- appearance deve permanecer depois da responsividade principal;
- previews devem permanecer depois de appearance;
- classificações tardias devem permanecer depois dos previews;
- mensagens devem permanecer depois das classificações;
- reduced motion final deve ser o último import.

## 22. Critérios para novos estilos

1. Identificar o domínio e a posição necessária na cascata.
2. Preferir o módulo existente do domínio quando a posição for compatível.
3. Criar módulo adicional quando mover a regra mudaria precedência.
4. Não importar CSS em componentes.
5. Atualizar o teste de ordem de imports.
6. Executar lint, testes, build, bundle check e regressão visual.

## 23. Regras contra duplicação

Esta etapa não removeu duplicações existentes. Novas regras não devem copiar seletores sem uma justificativa de cascata. Uma futura limpeza deverá possuir baseline próprio, comparação semântica e autorização separada.

## 24. CSS legado e limitações atuais

- estruturas administrativas legadas permanecem deliberadamente;
- 26 famílias de fontes continuam sendo carregadas;
- duplicações e hardcodes existentes foram preservados;
- media queries públicas e administrativas ainda compartilham módulos quando eram fisicamente intercaladas;
- classificações futuras continuam somente em preview.

## 25. Limpeza futura

Ficam fora da Etapa 7:

- remoção de CSS sem consumidor;
- consolidação de seletores duplicados;
- otimização das fontes;
- padronização de breakpoints;
- conversão para layers, nesting ou CSS Modules;
- publicação de novos templates.

## 26. Testes e equivalência

`scripts/tests/styles-architecture.test.mjs` valida ordem completa, reconstrução do CSS-fonte, contagens, proprietários dos blocos, ausência de imports em componentes, remoção segura do `global.css` e política pública de templates.

O build comprova que o asset compilado e seu SHA-256 permanecem idênticos ao baseline.

## 27. Rollback

Cada parte da Etapa 7 foi isolada em commit próprio. Para rollback, reverta o commit mais recente da etapa na ordem inversa, execute toda a validação e não altere a `main` sem revisão explícita. Não use `reset --hard` em worktree com alterações.

## 28. Garantias

- nenhuma propriedade ou valor foi alterado;
- nenhum seletor foi removido;
- nenhuma duplicação foi limpa;
- nenhuma fonte foi otimizada;
- nenhum componente React foi alterado;
- nenhum dado, localStorage, Supabase ou migration foi alterado;
- Etapa 8 não foi executada.
