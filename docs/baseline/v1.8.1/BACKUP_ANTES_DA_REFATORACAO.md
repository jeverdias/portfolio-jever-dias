# Backup antes da futura refatoração

## Escopo do backup atual

O botão **Backup**, disponível em **Painel administrativo > Repositórios**, gera um JSON com:

```text
version
exportedAt
site
projects
```

O campo `site` contém as configurações e o campo `projects` contém os projetos. Imagens, currículo e demonstrações entram apenas como referências de URL; os arquivos binários do Supabase Storage não são copiados para dentro do JSON.

O backup atual não inclui:

- senha;
- token ou sessão do Supabase;
- chave anônima ou service role;
- UUID administrativo;
- variáveis de ambiente;
- mensagens privadas de contato;
- conteúdo binário do Storage.

## Como gerar com segurança

1. Abra o projeto localmente na branch `develop`.
2. Entre no painel administrativo.
3. Abra **Repositórios**.
4. Aguarde o indicador de salvamento terminar.
5. Clique em **Backup**.
6. Guarde o arquivo `portfolio-jever-backup-AAAA-MM-DD.json` fora da pasta pública do site.
7. Não envie o backup para GitHub, chat, e-mail ou armazenamento público sem revisar o conteúdo.
8. Faça uma segunda cópia em uma pasta privada.

Não é necessário consultar ou exportar diretamente o Supabase para produzir esse backup lógico.

## Conferência recomendada

Abra o JSON em um editor de texto e confirme:

- existência de `version`, `site` e `projects`;
- quantidade esperada de projetos;
- IDs preservados;
- URLs de capas e galerias presentes;
- ausência de senha, token, sessão, service role e mensagens.

Para registrar a integridade no PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath "CAMINHO_DO_BACKUP.json"
```

Anote o hash em um arquivo privado. Não é necessário colocar o backup no repositório.

## Teste de restauração

Antes de qualquer mudança de formato:

1. use uma cópia local controlada do projeto;
2. gere um novo backup do estado existente;
3. clique em **Importar** e selecione a cópia que será testada;
4. confira identidade, aparência, seções e projetos;
5. valide capas, galerias e links;
6. recarregue a página e confirme a persistência local;
7. não faça o teste no Supabase real sem autorização expressa.

O importador aceita o objeto atual com `site` e `projects` e também o formato legado que contém diretamente uma lista de projetos.

## Limitações conhecidas

- O backup lógico não duplica arquivos do bucket `portfolio-assets`.
- Uma URL removida do Storage deixa de funcionar mesmo que ainda apareça no JSON.
- Mensagens possuem fluxo separado e não entram no backup geral.
- O campo `version` atual vale `2`; ele identifica o envelope do backup, não uma migration do PostgreSQL.
- O projeto ainda não possui controle de revisão para impedir sobrescrita entre duas sessões administrativas.

## Regra para a futura refatoração

Antes de alterar o formato persistido:

- gerar o backup lógico;
- confirmar seu hash;
- preservar as chaves atuais do localStorage;
- testar os fixtures anonimizados;
- usar somente migrations aditivas no banco;
- não acessar dados reais do Supabase sem autorização.
