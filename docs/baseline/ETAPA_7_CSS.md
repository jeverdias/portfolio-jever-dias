# Baseline final da Etapa 7 — CSS

**Versão:** v1.8.8
**Branch de trabalho:** `develop`

## Objetivo

Registrar a modularização física do CSS sem alteração visual ou funcional.

## Commits

| Etapa | Commit | Mensagem |
|---|---|---|
| 7.1 | `8fab72873a7866db578116925e4d65aa90e538b8` | `refactor(styles): extrai fontes e tokens` |
| 7.2 | `a8eca48f05816ce7fd6d565c6ed905a6060bb100` | `refactor(styles): separa base e estilos públicos` |
| 7.3 | `688dce15d2a08733d44efb4034fd8b7fe4203914` | `refactor(styles): separa estilos administrativos` |
| 7.4 | `51604545dd0542cada7e399005baede150cd2295` | `refactor(styles): organiza temas e responsividade` |

Os quatro commits foram concluídos e enviados para `origin/develop`. A Etapa 7 está encerrada na versão final v1.8.8.

## Métricas antes e depois

| Métrica | Antes | Depois |
|---|---:|---:|
| Asset CSS | `index-BBMVsMFR.css` | `index-BBMVsMFR.css` |
| CSS minificado | 148.604 bytes | 148.604 bytes |
| CSS gzip | 27.491 bytes | 27.491 bytes |
| Regras | 1.413 | 1.413 |
| Seletores | 1.618 | 1.618 |
| Media queries | 14 | 14 |
| Keyframes | 8 | 8 |
| `!important` | 12 | 12 |
| Famílias de fontes | 26 | 26 |
| Designs | 30 | 30 |
| Assets CSS iniciais | 1 | 1 |

SHA-256 antes e depois:

```text
3cbe75fdad43a99e1d5c43779b55b779d37140b2ff014ffe8f41a4c07573ba81
```

## Arquivos CSS finais

O ponto único é `src/styles/index.css`. Ele importa tokens, classificações fundacionais, base, módulos públicos, modais, módulos administrativos, animações, responsividade, appearance, previews, classificações tardias, mensagens, foco e reduced motion final.

O antigo `src/styles/global.css` foi totalmente mapeado e removido na Etapa 7.4.

## Validação

- reconstrução do CSS-fonte com SHA idêntico;
- lint;
- testes Node;
- validação das oito classificações;
- build Vite;
- bundle check;
- comparação visual automatizada;
- `git diff --check`.

O resultado final registrou 376 testes Node e 8 classificações aprovadas, totalizando 384 verificações combinadas.

## Status final

- `src/styles/global.css` foi removido;
- `src/styles/index.css` tornou-se o ponto único de entrada;
- o CSS compilado permaneceu idêntico ao baseline;
- `main` e produção permanecem inalteradas;
- nenhum PR, merge, tag ou deploy foi executado;
- a Etapa 8 continua cancelada e não iniciada.

## Screenshots

As imagens de comparação ficam fora do commit, em área temporária de visualização. Nenhum screenshot sensível, temporário ou gerado é versionado.

## Rollback

Reverter os commits da Etapa 7 na ordem 7.4, 7.3, 7.2 e 7.1, validando o CSS após cada reversão. Não usar `reset --hard` nem apagar alterações do usuário.

## Pendências fora da Etapa 7

- limpeza de duplicações;
- remoção de CSS legado;
- análise de seletores sem consumidor;
- otimização das 26 famílias de fontes;
- eventual padronização de breakpoints;
- Etapa 8, cancelada e não iniciada.
