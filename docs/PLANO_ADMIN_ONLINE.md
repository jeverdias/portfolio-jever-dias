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

## Etapas futuras

1. Criar o projeto Supabase.
2. Criar tabelas e bucket de imagens.
3. Configurar o usuário administrador.
4. Ativar políticas de segurança.
5. Trocar o armazenamento local pelas consultas do Supabase.
6. Migrar os projetos atuais.
7. Testar Login, edição, upload e publicação no Netlify.
