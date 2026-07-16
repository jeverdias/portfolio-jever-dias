# Configurar o Supabase exclusivo do portfólio

O portfólio não compartilha banco, Storage, usuários ou políticas com `sistema-campo-homologacao` ou `sistema-campo-vita`.

## Situação atual

- Organização: `JD Org`.
- Projeto novo: `site-jd`.
- Região: São Paulo (`sa-east-1`).
- `sistema-campo-homologacao`: pausado.
- `sistema-campo-vita`: ativo e sem alterações.
- Schema inicial: aplicado.
- Senha técnica: redefinida pelo painel oficial com valor aleatório forte.

O identificador e as chaves públicas atuais são definitivos. O valor sensível da senha técnica não foi gravado no repositório nem exibido.

## Administrador

Em **Authentication > Users**, crie ou convide somente o administrador do portfólio. Copie o UUID e execute:

```sql
insert into public.portfolio_admins (user_id)
values ('UUID-DO-USUARIO');
```

O envio do convite por email é uma ação externa e deve ser confirmado por Jever antes de ser realizado.

## Variáveis locais e Netlify

Use apenas a URL e a chave pública `anon` ou `publishable` do projeto definitivo:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

No Netlify, cadastre as mesmas variáveis em **Site configuration > Environment variables**. Nunca coloque a chave `service_role` no frontend ou no GitHub.

## Primeira sincronização

1. Abra o portfólio local e exporte um backup pelo painel.
2. Configure as variáveis definitivas e reinicie o site.
3. Entre com email e senha do administrador autorizado.
4. Importe o backup.
5. Teste a leitura e gravação de configurações e projetos.
6. Envie uma imagem de teste e confirme a URL no bucket `portfolio-assets`.
7. Envie uma mensagem pelo formulário e confirme sua aparição em **Mensagens**.

## Segurança aplicada

- leitura pública somente do conteúdo necessário;
- projetos não publicados visíveis apenas para o administrador;
- escrita permitida somente para UUIDs cadastrados em `portfolio_admins`;
- imagens e PDF em bucket exclusivo `portfolio-assets`;
- PIN local bloqueado automaticamente no site publicado;
- chave `service_role` nunca usada no navegador.
