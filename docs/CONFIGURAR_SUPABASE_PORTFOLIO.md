# Configurar o Supabase exclusivo do portfólio

O portfólio não deve compartilhar banco, Storage, usuários ou políticas com os projetos `sistema-campo-homologacao` e `sistema-campo-vita`.

## Situação atual da conta

A organização `JD Org` usa os dois projetos gratuitos permitidos. Para criar `portfolio-jever-dias`, será necessário escolher uma destas opções sem alterar os projetos atuais:

1. fazer upgrade da organização para o plano Pro; ou
2. usar outra conta Supabase que ainda tenha vaga gratuita e criar uma organização exclusiva para o portfólio.

## Criação

1. Crie um projeto chamado `portfolio-jever-dias` em uma organização separada e disponível.
2. Escolha a região de São Paulo quando estiver disponível.
3. No SQL Editor do projeto novo, execute `supabase/schema.sql`.
4. Em Authentication > Users, crie somente o usuário administrador do portfólio.
5. Copie o UUID desse usuário e execute:

```sql
insert into public.portfolio_admins (user_id)
values ('UUID-DO-USUARIO');
```

## Variáveis locais e Netlify

Use apenas a URL e a chave pública `anon` do projeto novo:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

No Netlify, cadastre as mesmas variáveis em **Site configuration > Environment variables**. Nunca coloque a chave `service_role` no site ou no GitHub.

## Primeira sincronização

1. Abra o portfólio local e exporte um backup pelo painel.
2. Configure o Supabase e reinicie o site.
3. Entre com o email e a senha do novo usuário administrador.
4. Importe o backup. As configurações e os projetos serão gravados nas tabelas protegidas por RLS.
5. Depois disso, capas, prints e currículo podem ser enviados pelo Storage.

## Segurança aplicada

- leitura pública somente do conteúdo necessário;
- projetos não publicados visíveis apenas para o administrador;
- escrita permitida somente para UUIDs cadastrados em `portfolio_admins`;
- imagens e PDF em bucket exclusivo `portfolio-assets`;
- PIN local bloqueado automaticamente no site publicado;
- chave `service_role` nunca usada no navegador.
