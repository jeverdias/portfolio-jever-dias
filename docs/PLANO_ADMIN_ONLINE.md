# Plano do painel administrativo online

## Recomendação

Manter o portfólio público no Netlify e conectar o painel ao Supabase. Isso evita criar um servidor próprio e resolve Login, dados persistentes e armazenamento das imagens.

## Serviços

- **Supabase Auth:** acesso exclusivo do administrador.
- **Postgres:** dados do site e dos projetos.
- **Supabase Storage:** capas, prints e futuros vídeos demonstrativos.
- **Netlify:** hospedagem e publicação do frontend Vite.

## Estrutura sugerida

### `site_settings`

- `id`
- `name`
- `role`
- `eyebrow`
- `intro`
- `email`
- `linkedin`
- `github`
- `location`
- contadores e legendas
- `updated_at`

### `projects`

- `id`
- `title`
- `theme`
- `type`: `powerbi`, `website` ou `content`
- `category`
- `description`
- `details`
- `content_format`
- `audience`
- `tags`
- `cover_url`
- `embed_url`
- `external_url`
- `accent`
- `featured`
- `position`
- `updated_at`

### `project_images`

- `id`
- `project_id`
- `image_url`
- `alt_text`
- `position`

## Segurança

- Permitir leitura pública apenas dos projetos publicados.
- Permitir criação, alteração e exclusão somente ao usuário administrador autenticado.
- Manter políticas RLS ativas.
- Guardar fotos no Storage; o banco recebe apenas as URLs.
- O link incorporado do Power BI pode ser escondido visualmente, mas um link público ainda pode ser encontrado por um usuário técnico no navegador. Para proteção real, usar Power BI com autenticação ou incorporação segura por token.

## Implementação preparada

O código de Auth, Database, Storage, sincronização e políticas RLS está pronto. O arquivo `supabase/schema.sql` cria a estrutura isolada. A criação efetiva está bloqueada apenas pelo limite de dois projetos gratuitos da conta atual.

Próximas ações externas:

1. liberar uma vaga por plano Pro ou usar outra conta Supabase disponível, sem alterar os sistemas atuais;
2. criar o projeto exclusivo `portfolio-jever-dias`;
3. executar `supabase/schema.sql`;
4. criar e autorizar o usuário administrador;
5. cadastrar as variáveis no Netlify;
6. importar o backup atual e testar a sincronização.
