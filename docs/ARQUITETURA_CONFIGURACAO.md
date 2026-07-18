# Arquitetura da configuração do Site JD

**Versão do aplicativo:** 1.8.3

**Versão lógica interna do schema:** 2

**Etapa:** 2 — defaults, schema, normalização e migrations em memória

## Objetivo

A configuração do site possui uma única fonte canônica e uma única entrada pública de normalização. Dados padrão, cache local, backup ou linha recebida do Supabase podem passar pelo mesmo fluxo previsível antes de entrar no estado React.

```text
defaults, localStorage, backup ou Supabase
                  |
                  v
       migrations somente em memória
                  |
                  v
            normalização
                  |
                  v
       configuração segura e clonada
                  |
                  v
              estado React
```

Nesta etapa não existe migration no banco, escrita automática, alteração das chaves do `localStorage`, mudança no formato de `site_settings.data`, motor de templates ou mudança da classificação pública. `portfolio-app` continua sendo o único modelo publicado.

## Módulos e responsabilidades

| Módulo | Responsabilidade |
|---|---|
| `src/core/config/defaultSiteConfig.js` | Fonte canônica dos valores atuais; exporta defaults congelados e uma fábrica de cópias independentes. |
| `src/core/config/siteSchema.js` | Declara grupos conceituais, políticas de arrays, clonagem, congelamento, validação estrutural e normalização da forma. |
| `src/core/config/configVersion.js` | Define as versões lógicas 0 e 2 e identifica a versão de uma entrada sem persistir metadados. |
| `src/core/config/migrateSiteConfig.js` | Executa migrations puras, ordenadas e somente em memória; normaliza o resultado. |
| `src/core/config/normalizeSiteConfig.js` | Entrada canônica pública para obter uma configuração compatível e segura. |
| `src/data/site.js` | Fachada compatível para imports históricos de `siteConfig` e `technologies`. |
| `src/utils/compatibility.js` | Fachada temporária que reexporta a normalização central e mantém contratos de cache e projetos. |

## Estrutura conceitual

O schema documenta identidade, navegação, hero, landing page, contatos e redes sociais, currículo, trajetória, credibilidade, aparência, classificação, visibilidade das seções, métricas, tecnologias, especialidades, biblioteca de figurinhas e modelos de exibição dos projetos. Ele valida a estrutura atual sem introduzir uma dependência pesada e sem mudar nomes persistidos.

## Regras de normalização

- `undefined`, `null`, arrays ou valores primitivos são tratados como configuração ausente.
- Campos conhecidos ausentes ou com tipo estrutural inválido recebem o valor padrão correspondente.
- Valores válidos, IDs, URLs, contatos opcionais e conteúdo editorial são preservados.
- Objetos aninhados conhecidos são completados por chave, sem modificar a entrada.
- Campos desconhecidos são preservados e clonados para manter compatibilidade futura.
- Classificação válida é mantida; classificação inválida usa o fallback seguro `portfolio-app` e seus metadados.
- A classificação administrativa permanece armazenável, mas não é promovida a classificação pública.
- O resultado é novo, determinístico e independente dos defaults e de outras normalizações.

## Política para arrays

Arrays nunca são combinados por índice.

| Campo | Entrada válida não vazia | Array vazio | Tipo inválido |
|---|---|---|---|
| `metrics`, `techItems`, `specialties` | Preserva itens com objeto e `id` válido | Usa os defaults, mantendo o comportamento histórico | Usa os defaults |
| `stickerLibrary` | Preserva os itens válidos | Preserva vazio intencional | Usa o default vazio |
| `displayModels` | Preserva os modelos internos e acrescenta modelos personalizados válidos | Usa os modelos internos | Usa os modelos internos |

Itens inválidos são descartados somente nas coleções estruturadas que exigem `id`. Todos os itens preservados são clonados.

## Migrations em memória

Entradas sem `schemaVersion` são consideradas versão lógica 0. A versão atual é 2:

1. **0 → 1:** reconhece a classificação textual legada quando o identificador não existe.
2. **1 → 2:** converte contadores legados de dashboards e sistemas em métricas apenas quando `metrics` está ausente.

As migrations são puras, ordenadas, idempotentes e não acessam `window`, `document`, `localStorage` ou Supabase. Uma versão futura desconhecida não executa migrations antigas e seus dados adicionais permanecem intactos. O campo `schemaVersion` não é adicionado ao resultado se não existia, evitando mudar o formato atualmente salvo.

## Compatibilidade e imutabilidade

- `src/data/site.js` conserva os imports anteriores.
- `src/utils/compatibility.js` conserva os nomes públicos e as chaves `jd-portfolio-site-v1`, `jd-portfolio-projects-v1` e `jd-contact-last-submit`.
- Backups atuais continuam aceitos pelo validador existente.
- O objeto de entrada e as fixtures não são modificados.
- Defaults canônicos são profundamente congelados.
- A fábrica de defaults e cada normalização devolvem objetos e arrays editáveis independentes.
- Nenhum ID, URL, caminho de Storage, tabela ou contrato do painel foi renomeado.

## Limitações atuais e Etapa 3

Esta camada prepara os dados, mas não controla como eles são lidos ou salvos. Permanecem para a Etapa 3 os adaptadores de `localStorage` e Supabase, debounce, fila de salvamento, retry, concorrência e separação explícita entre estado e persistência. Esses recursos não devem ser misturados novamente aos módulos puros de configuração.

## Baseline e versões

`docs/baseline/v1.8.1` e o PDF v1.8.1 representam a captura anterior à refatoração. A v1.8.2 registra os testes de compatibilidade adicionados depois da captura. A v1.8.3 registra esta centralização interna. Essa diferença é intencional; o baseline histórico não deve ser renomeado.
