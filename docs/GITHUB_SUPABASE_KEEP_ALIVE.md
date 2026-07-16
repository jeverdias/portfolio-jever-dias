# Checklist — Pulso do Supabase

Status: **workflow preparado, ainda inativo**.

O arquivo `.github/workflows/supabase-keep-alive.yml` faz duas consultas públicas pequenas a cada seis dias. Ele só funcionará depois de estar na branch padrão e receber os Secrets definitivos.

## 1. Banco e segurança

- [x] Criar um projeto separado e exclusivo para o portfólio.
- [x] Aplicar o schema, tabelas, políticas RLS e bucket.
- [x] Redefinir a senha técnica com valor aleatório forte.
- [x] Criar e autorizar o usuário administrador.
- [ ] Testar o login do painel.
- [ ] Testar leitura e gravação de um projeto.
- [ ] Testar envio de imagem ao Storage.
- [ ] Testar recebimento de mensagem.

## 2. Workflow

- [x] Criar `.github/workflows/supabase-keep-alive.yml`.
- [x] Adicionar execução manual com `workflow_dispatch`.
- [x] Agendar a cada seis dias, fora do início da hora.
- [x] Consultar somente `site_settings` e `portfolio_projects`.
- [x] Configurar repetição, tempo máximo e logs sem conteúdo sensível.
- [x] Revisar o workflow após a configuração do projeto definitivo.

## 3. Secrets do GitHub

- [ ] Abrir `jeverdias/portfolio-jever-dias` em **Settings > Secrets and variables > Actions**.
- [ ] Criar `SUPABASE_URL` com a URL definitiva.
- [ ] Criar `SUPABASE_ANON_KEY` com a chave pública definitiva.
- [ ] Confirmar que nenhuma chave foi escrita diretamente no workflow.

## 4. Publicação e teste

- [ ] Pedir autorização explícita antes de qualquer commit.
- [ ] Revisar as mudanças na branch de desenvolvimento.
- [ ] Pedir autorização explícita antes de qualquer push.
- [ ] Publicar na `main`, pois o agendamento usa a branch padrão.
- [ ] Executar manualmente em **Actions > Manter Supabase ativo > Run workflow**.
- [ ] Confirmar execução em verde e atividade no Supabase.
- [ ] Conferir a primeira execução agendada.

## Observações

- Um pulso reduz o risco de pausa no plano gratuito, mas não garante disponibilidade equivalente ao plano pago.
- O workflow não está ativo apenas por existir localmente; requer commit, push e Secrets.
- Nenhum commit ou push deve ser realizado sem autorização de Jever.
