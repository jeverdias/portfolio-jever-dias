# Plano do painel administrativo online

## Arquitetura adotada

O portfólio público permanece no Netlify e o painel se conecta a um projeto Supabase exclusivo. Não existe servidor próprio para manter.

- **Supabase Auth:** acesso exclusivo do administrador.
- **Postgres:** configurações, projetos e mensagens recebidas.
- **Supabase Storage:** capas, prints, figurinhas e futuros vídeos demonstrativos.
- **Netlify:** hospedagem e publicação do frontend Vite.

## Estrutura implementada

- `site_settings`: conteúdo e aparência do site.
- `portfolio_projects`: projetos, estudos de caso, links, capas e galeria.
- `portfolio_admins`: lista dos usuários autorizados a administrar.
- `contact_messages`: contatos enviados pelo site.
- bucket `portfolio-assets`: arquivos públicos do portfólio.

O schema completo e as políticas estão em `supabase/schema.sql` e na migration de `supabase/migrations/`.

## Segurança

- Leitura pública somente do conteúdo publicado.
- Escrita administrativa somente para usuários autenticados presentes em `portfolio_admins`.
- Inserção pública de contato limitada aos campos e tamanhos previstos no schema.
- RLS ativa em todas as tabelas.
- Arquivos no Storage; o banco guarda apenas os endereços.
- Chave `service_role` nunca utilizada no navegador, Netlify ou workflow.
- O link público incorporado do Power BI pode ser ocultado visualmente, mas não fica tecnicamente secreto. Proteção real exige Power BI autenticado ou incorporação segura por token.

## Situação em 15/07/2026

- Projeto separado `site-jd` criado na região de São Paulo.
- `sistema-campo-homologacao` pausado; `sistema-campo-vita` preservado.
- Schema e Storage aplicados no projeto novo.
- Integração do frontend, mensagens e upload implementados.
- Senha técnica redefinida pelo painel oficial com valor aleatório forte, sem apagar o projeto ou o schema.
- Convite/cadastro do administrador depende da confirmação do email por Jever.
- Variáveis de produção dependem de acesso autenticado ao Netlify.
- Workflow de pulso depende de commit/push autorizado e Secrets do GitHub.

## Próximas ações

1. Criar ou convidar o administrador e cadastrar seu UUID em `portfolio_admins`.
2. Configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no Netlify.
3. Testar login, gravação, mensagens e upload.
4. Importar o backup atual, se desejado.
5. Somente com autorização, publicar o workflow e cadastrar seus Secrets no GitHub.
