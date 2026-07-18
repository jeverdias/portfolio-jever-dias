# Baseline técnico do Site JD

## Identificação

| Item | Valor |
|---|---|
| Versão funcional de referência | 1.8.1 |
| Versão da etapa de compatibilidade | 1.8.2 |
| Commit de referência | `47686a5f41487198ceeaabdb239e565bda583905` |
| Branch | `develop` |
| Data | 17/07/2026 |
| Produção | Não alterada; permanece vinculada à `main` |

Este baseline registra o comportamento anterior à modularização. O commit de referência contém a documentação técnica da versão 1.8.1. A versão 1.8.2 acrescenta somente proteções de compatibilidade, fixtures, testes e a fixação explícita do portfólio como classificação pública.

## Comandos executados no baseline

```text
pnpm run lint
pnpm run test:all
pnpm run build
pnpm run check:bundle
```

Resultados no commit de referência:

| Verificação | Resultado | Duração aproximada |
|---|---|---:|
| ESLint | Aprovado | 14,72 s |
| Testes Node | 12 aprovados, 0 reprovados | 0,13 s |
| Classificações | 8 aprovadas | incluída em `test:all` |
| Build Vite | Aprovado | 5,34 s de build; 7,27 s no comando |
| Bundle | Aprovado | 1,15 s |

O Vite informou apenas que o processamento de CSS concentra parte relevante do tempo de build. Não houve erro de compilação.

## Principais arquivos gerados pelo build

| Chunk ou arquivo | Tamanho | Gzip |
|---|---:|---:|
| CSS principal | 148,60 kB | 27,50 kB |
| JavaScript principal | 88,34 kB | 28,51 kB |
| AdminPanel | 105,64 kB | 24,57 kB |
| React | 182,16 kB | 57,34 kB |
| Supabase | 198,07 kB | 50,90 kB |
| Ícones | 27,67 kB | 10,10 kB |
| ProjectDetail | 6,16 kB | 2,08 kB |
| ProjectModal | 4,38 kB | 1,69 kB |
| ContactModal | 2,58 kB | 1,17 kB |

O `check:bundle` mede o arquivo principal sem compressão como aproximadamente 86,28 KB e exige os fornecedores compartilhados separados.

## Rotas públicas

| Rota | Comportamento |
|---|---|
| `/` | Home do portfólio |
| `/#projetos` | Âncora da seção Portfólio |
| `/#servicos` | Âncora de especialidades/serviços |
| `/#sobre` | Âncora Sobre |
| `/#contato` | Âncora Contato |
| `/portfolio/{id}` | Página individual e estudo de caso |

A navegação usa History API e o redirecionamento SPA do Netlify. Não existe React Router nesta versão.

## Seções públicas

1. Header e navegação;
2. Hero;
3. Especialidades;
4. Portfólio, busca e filtros;
5. Sobre;
6. Credibilidade, métricas e trajetória;
7. Currículo e Lattes;
8. Contato;
9. Footer;
10. Página individual de projeto;
11. Modal de demonstração;
12. Modal de contatos e redes sociais.

`LandingHighlights` existe internamente, mas não deve ser publicado enquanto o tipo público estiver fixado em `portfolio-app`.

## Abas administrativas

1. Classificação do site;
2. Visão geral;
3. Configurações;
4. Aparência;
5. Trajetória;
6. Repositórios;
7. Box/figurinhas;
8. Especialidades;
9. Mensagens, somente no modo Supabase autenticado;
10. Guia do site.

## Persistência local

| Chave | Finalidade |
|---|---|
| `jd-portfolio-site-v1` | Cache das configurações do site |
| `jd-portfolio-projects-v1` | Cache dos projetos |
| `jd-contact-last-submit` | Controle local do último envio de contato |
| `jd-portfolio-ai-category-v1` | Marcador da compatibilidade da categoria de IA |

As três primeiras chaves são contratos públicos de compatibilidade desta etapa. Nenhuma chave foi renomeada.

## Supabase

### Tabelas

- `portfolio_admins`;
- `site_settings`;
- `portfolio_projects`;
- `contact_messages`.

### Storage

- Bucket: `portfolio-assets`;
- leitura pública dos arquivos publicados;
- escrita e exclusão restritas aos administradores autorizados;
- imagens e PDF limitados a 10 MB por arquivo.

### Migrations existentes

1. `202607150001_portfolio_initial.sql`;
2. `202607160001_security_hardening.sql`.

Nenhuma migration foi criada na etapa 0 ou 1.

## Funcionalidades críticas preservadas

- portfólio como tipo público;
- identidade e conteúdo editáveis;
- visibilidade individual das seções;
- quatro tipos de projeto: `powerbi`, `website`, `content` e `ai`;
- cards, filtros, páginas individuais e estudos de caso;
- projetos ocultos fora da coleção pública;
- incorporação de Power BI sem botão que exponha o endereço;
- links, vídeos, documentos, capas e galerias;
- aparência configurável sem alterar conteúdo;
- classificação administrativa preservada sem publicação automática;
- autenticação Supabase e allowlist administrativa;
- RLS, RPC de contato e Storage protegido para escrita;
- salvamento automático e fallback local;
- importação e exportação de backup;
- acessibilidade de modais e navegação por teclado;
- divisão do bundle e carregamento tardio do painel.

## Registro visual

As imagens de referência ficam em `docs/baseline/v1.8.1/screenshots/`. Elas usam somente dados padrão locais e uma sessão administrativa temporária, sem senha visível, token, mensagens reais ou dados do Supabase.

O objetivo dessas imagens é comparação manual de regressão; elas não substituem testes de acessibilidade ou testes visuais automatizados.
