# Validação das etapas 0 e 1

## Contexto

- Branch: `develop`;
- commit base: `47686a5f41487198ceeaabdb239e565bda583905`;
- versão da aplicação após os testes de compatibilidade: `1.8.2`;
- data: 17/07/2026;
- banco real: não acessado;
- migrations: nenhuma criada;
- deploy: nenhum executado.

## Resultados finais

| Comando | Resultado | Duração aproximada |
|---|---|---:|
| `pnpm run lint` | Aprovado | 12,52 s |
| `pnpm run test:all` | Aprovado | 3,90 s |
| `pnpm run build` | Aprovado | 3,64 s |
| `pnpm run check:bundle` | Aprovado | 1,59 s |

### Testes

- 33 testes Node aprovados;
- 0 reprovados;
- 21 testes novos de compatibilidade;
- 12 testes anteriores de validação e segurança;
- 8 classificações verificadas para desktop e celular.

## Bundle final

| Chunk ou arquivo | Tamanho | Gzip |
|---|---:|---:|
| CSS principal | 148,60 kB | 27,50 kB |
| JavaScript principal | 88,23 kB | 28,29 kB |
| AdminPanel | 105,64 kB | 24,57 kB |
| React | 182,16 kB | 57,34 kB |
| Supabase | 198,07 kB | 50,90 kB |
| Ícones | 27,67 kB | 10,10 kB |
| ProjectDetail | 6,16 kB | 2,08 kB |
| ProjectModal | 4,38 kB | 1,69 kB |
| ContactModal | 2,58 kB | 1,17 kB |

O `check:bundle` registrou 86,17 KB para o pacote principal e confirmou três blocos compartilhados separados.

## Comparação com o baseline anterior

| Medida | Baseline 1.8.1 | Etapa 1.8.2 | Diferença |
|---|---:|---:|---:|
| Testes Node | 12 | 33 | +21 |
| Classificações | 8 | 8 | 0 |
| Pacote principal medido | 86,28 KB | 86,17 KB | -0,11 KB |
| CSS principal | 148,60 kB | 148,60 kB | 0 |
| Migrations | 2 | 2 | 0 |

Não foi observada alteração visual relevante. As dez telas de referência foram registradas e revisadas manualmente.

## Comportamentos protegidos

- leitura das chaves atuais do localStorage;
- fallback para cache ausente ou JSON inválido;
- aceitação de configuração antiga e incompleta;
- preservação de aparência, visibilidade, contatos opcionais e IDs;
- preservação de uma classificação válida mesmo com versão de layout antiga;
- fallback de classificação inválida para `portfolio-app`;
- publicação fixa do portfólio nesta etapa;
- aceitação de projeto atual e legado;
- capas, galeria vazia e galeria preenchida;
- projeto oculto fora da coleção pública;
- projeto destacado dentro da coleção pública;
- reconhecimento de `powerbi`, `website`, `content` e `ai`;
- cache antigo com compatibilidade da categoria de IA;
- lista pública vazia sem erro.

## Avisos

Não houve warning funcional no resultado final. Nomes hash dos chunks mudaram, como esperado em qualquer novo build. A pasta `dist` permanece ignorada pelo Git.
