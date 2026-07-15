# Checklist futuro — Pulso do Supabase

Status: **aguardando o banco de dados exclusivo do portfólio ficar pronto**.

Este checklist deve ser executado somente depois que o projeto Supabase do portfólio estiver criado, conectado e funcionando. Por enquanto, nenhum workflow de pulso está ativo no GitHub.

## 1. Confirmar que o banco está pronto

- [ ] Criar um projeto Supabase separado e exclusivo para o portfólio.
- [ ] Confirmar que o projeto está ativo no painel do Supabase.
- [ ] Aplicar o arquivo `supabase/schema.sql` no projeto correto.
- [ ] Confirmar que as tabelas `site_settings`, `portfolio_projects` e `portfolio_admins` existem.
- [ ] Confirmar que as políticas RLS foram aplicadas.
- [ ] Criar e testar o usuário administrador do portfólio.
- [ ] Testar o login do painel administrativo.
- [ ] Testar a leitura e a gravação de um projeto.
- [ ] Testar o envio de uma imagem para o Storage.

## 2. Separar as informações necessárias

- [ ] Copiar a URL do projeto, no formato `https://xxxxxxxx.supabase.co`.
- [ ] Copiar somente a chave pública `anon` ou `publishable`.
- [ ] Não copiar nem utilizar a chave `service_role` no GitHub Actions.
- [ ] Confirmar que a chave pública consegue consultar as tabelas permitidas pelas políticas RLS.

## 3. Criar o workflow no momento correto

- [ ] Criar `.github/workflows/supabase-keep-alive.yml`.
- [ ] Adicionar execução manual com `workflow_dispatch`.
- [ ] Adicionar agendamento para gerar atividade antes do período de sete dias.
- [ ] Usar um horário fora do início de cada hora para reduzir atrasos do GitHub Actions.
- [ ] Fazer consultas pequenas e reais em `site_settings` e `portfolio_projects`.
- [ ] Configurar tentativas automáticas para falhas temporárias.
- [ ] Limitar o tempo máximo da execução.
- [ ] Garantir que a resposta e as chaves não sejam impressas nos logs.

## 4. Configurar os Secrets no GitHub

- [ ] Abrir o repositório `jeverdias/portfolio-jever-dias` no GitHub.
- [ ] Entrar em **Settings > Secrets and variables > Actions**.
- [ ] Criar o Secret `SUPABASE_URL`.
- [ ] Criar o Secret `SUPABASE_ANON_KEY`.
- [ ] Conferir se nenhum valor secreto foi colocado diretamente no arquivo do workflow.

## 5. Publicar e testar

- [ ] Pedir autorização de Jever antes de fazer commit.
- [ ] Colocar o workflow primeiro na branch de desenvolvimento.
- [ ] Revisar o arquivo antes de enviar para a branch `main`.
- [ ] Lembrar que workflows agendados só funcionam quando estão na branch padrão.
- [ ] Abrir **Actions > Manter Supabase ativo > Run workflow**.
- [ ] Confirmar que a execução manual terminou em verde.
- [ ] Conferir no Supabase se as consultas apareceram nos logs.
- [ ] Aguardar a primeira execução agendada e confirmar o resultado.

## 6. Acompanhamento

- [ ] Verificar periodicamente se o workflow continua habilitado.
- [ ] Observar emails de aviso de pausa enviados pelo Supabase.
- [ ] Observar falhas ou atrasos enviados pelo GitHub Actions.
- [ ] Reativar o workflow se o GitHub o desabilitar por inatividade do repositório.
- [ ] Reavaliar o intervalo caso o Supabase continue enviando avisos.
- [ ] Considerar o plano Pro se o portfólio precisar de disponibilidade garantida.

## Observações importantes

- O plano gratuito do Supabase pode pausar projetos com pouca atividade.
- Um pulso reduz o risco de pausa, mas não oferece garantia equivalente a um plano pago.
- A rotina não deve ser criada antes do banco porque ainda não existem endereço, chave e tabelas definitivas para testar.
- O workflow só será ativado depois de autorização explícita para commit e envio à branch `main`.
