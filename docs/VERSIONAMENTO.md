# Regra permanente de versionamento

Versão atual: **v1.5.1**.

Toda solicitação que corrigir, adicionar ou modificar o código deve atualizar a versão antes da entrega:

- **MAJOR** (`v1.0.0` → `v2.0.0`): mudança grande ou incompatível, reconstrução importante ou alteração de arquitetura.
- **MINOR** (`v1.0.0` → `v1.1.0`): nova funcionalidade compatível com o funcionamento atual.
- **PATCH** (`v1.1.0` → `v1.1.1`): correção pequena, ajuste visual ou bug sem nova funcionalidade relevante.

Checklist obrigatório ao concluir uma alteração:

- [ ] Classificar como MAJOR, MINOR ou PATCH.
- [ ] Atualizar a versão no `package.json`.
- [ ] Registrar a versão em `docs/MEMORIA_DO_PROJETO.md`.
- [ ] Executar lint e build.
- [ ] Informar a nova versão ao usuário.
- [ ] Sugerir uma mensagem de commit.
- [ ] Não executar commit ou push sem autorização explícita.
