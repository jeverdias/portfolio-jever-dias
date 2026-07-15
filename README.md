# Portfólio Jever Dias

Portfólio profissional em React + Vite, inspirado em uma landing page dark com azul e roxo. O projeto está preparado para publicação no Netlify e possui um modo administrador local para cadastrar projetos, capas e links sem alterar a interface manualmente.

Site publicado: [`jeverdias.netlify.app`](https://jeverdias.netlify.app)

## Onde está o projeto

Pasta local:

```text
C:\Users\jever\Documents\Site JD
```

Versão atual e próximos passos: [`docs/MEMORIA_DO_PROJETO.md`](docs/MEMORIA_DO_PROJETO.md).

## O que foi criado

- Header responsivo com navegação por seções.
- Hero com apresentação, chamadas para ação e resumo de experiência.
- Cards de especialidades.
- Projetos filtráveis por Power BI, sistema web, conteúdo digital e GPTs & Agentes de IA.
- Modal para incorporar relatórios do Power BI sem mostrar o endereço ao visitante.
- Modal para visualizar sites e abrir o projeto em uma nova aba.
- Modo administrador local com PIN, cadastro, edição, ordenação, imagem, importação e exportação JSON.
- Layout responsivo para computador, tablet e celular.
- Configuração pronta para build e publicação no Netlify.

## Estrutura de pastas

```text
Site JD/
├── docs/
│   └── MEMORIA_DO_PROJETO.md    # versões, decisões e histórico persistente
├── public/
│   ├── favicon.svg
│   └── og.png                   # imagem usada ao compartilhar o site
├── src/
│   ├── components/              # seções, cards, modais e painel administrativo
│   │   └── ui/                  # componentes pequenos e reutilizáveis
│   ├── data/
│   │   ├── projects.json        # projetos publicados por padrão
│   │   ├── projects.js          # tipos de projeto
│   │   └── site.js              # nome, texto, email e redes sociais
│   ├── hooks/
│   │   └── useProjectStore.js   # edição e persistência local dos projetos
│   ├── styles/
│   │   └── global.css           # identidade visual e responsividade
│   ├── App.jsx
│   └── main.jsx
├── .env.example                 # exemplo do PIN local
├── index.html
├── netlify.toml                 # configuração de publicação
├── package.json
└── vite.config.js
```

## Abrir no VS Code

O workspace já está configurado em `Site JD.code-workspace`.

Opção mais simples:

1. Dê dois cliques em `abrir-vscode.cmd`.
2. No VS Code, pressione `Ctrl + Shift + B`.
3. Escolha **Abrir portfólio local**. O navegador será aberto automaticamente.

Se preferir abrir manualmente:

1. Abra o VS Code.
2. Escolha **Arquivo > Abrir Workspace do Arquivo**.
3. Selecione `C:\Users\jever\Documents\Site JD\Site JD.code-workspace`.

Ou abra um terminal nesta pasta e execute:

```powershell
code .
```

## Abrir o site localmente

A forma mais confiável neste computador é dar dois cliques em:

```text
C:\Users\jever\Documents\Site JD\iniciar-site.cmd
```

O arquivo configura o Node.js utilizado pelo projeto, inicia o Vite e abre o navegador automaticamente.

Se `npm` estiver instalado no Windows, também é possível usar o CMD:

```cmd
cd /d "C:\Users\jever\Documents\Site JD"
npm install
npm run dev -- --host 127.0.0.1 --port 4173 --open
```

Para criar a versão de publicação:

```powershell
npm run build
```

## Editar informações pessoais

Abra `src/data/site.js` e ajuste:

- nome e cargo;
- texto principal;
- email;
- LinkedIn;
- GitHub;
- localização.

## Usar o modo administrador

1. Clique em **Login** no canto superior direito do portfólio.
3. No primeiro acesso, use o PIN `jd2026`.
4. Use **Configurações** para editar apresentação, contatos, LinkedIn, Instagram, GitHub e números do site.
5. Use **Repositórios** para cadastrar projetos, links, capa e até quatro prints.

Para mudar o PIN:

1. Copie `.env.example` para `.env`.
2. Altere `VITE_ADMIN_PIN`.
3. Reinicie o site local.

> O PIN é apenas uma barreira visual. Como o site é estático e não usa backend, ele não oferece autenticação segura.

### Organização dos repositórios

- **Power BI:** nome, tema, resumo, descrição, tecnologias, público, link incorporado e prints. O portfólio abre o relatório dentro do modal e não mostra botão com o link.
- **Sistema Web:** nome, tema, resumo, descrição, tecnologias, link do projeto, capa e prints.
- **Conteúdo Digital:** nome, tema, formato, público, resumo, link de leitura/download e prints. Exemplos: cartilhas, relatórios, infográficos, guias, apresentações e materiais interativos.
- **GPTs & Agentes de IA:** objetivo, contexto, instruções, recursos utilizados, supervisão necessária, limites, demonstração segura e prints.

### Precisa de banco de dados?

A versão atual funciona sem banco para edição no próprio computador. Os dados ficam no armazenamento do navegador e podem ser exportados como backup JSON.

Para que o Login seja seguro e as alterações apareçam online para todos sem editar o código, a recomendação é usar:

- **Supabase Auth** para o Login;
- **Supabase Database** para textos, links, ordem e categorias;
- **Supabase Storage** para capas e prints.

As imagens não devem ser gravadas diretamente no banco. O banco guarda apenas os endereços dos arquivos armazenados no Storage. O plano técnico está em [`docs/PLANO_ADMIN_ONLINE.md`](docs/PLANO_ADMIN_ONLINE.md).

### Power BI

Selecione o tipo **Power BI** e cole o link público incorporado, normalmente iniciado por `https://app.powerbi.com/view?...`. O relatório aparece dentro do modal; o endereço não é impresso na tela e não há botão externo.

### Sites e sistemas

Selecione **Sistema Web** e cole o endereço do projeto. O modal tenta mostrar o site e também oferece o botão para abrir em outra aba. Alguns sites bloqueiam a incorporação; nesses casos, o botão externo continua funcionando.

### Publicar alterações feitas no administrador

As alterações do painel são salvas no navegador atual. Para que todos os visitantes recebam a nova lista:

1. No painel, clique em **Exportar JSON**.
2. Substitua o conteúdo de `src/data/projects.json` pelo arquivo exportado.
3. Execute `npm run build`.
4. Envie a alteração ao GitHub; o Netlify fará uma nova publicação automaticamente.

## Git e GitHub

O Git local está conectado ao repositório público:

[`github.com/jeverdias/portfolio-jever-dias`](https://github.com/jeverdias/portfolio-jever-dias)

O GitHub Desktop pode abrir diretamente a pasta `C:\Users\jever\Documents\Site JD`. A branch principal é `main` e já acompanha `origin/main`.

Para as próximas alterações:

```powershell
git add .
git commit -m "descreva a alteracao"
git push
```

## Publicar no Netlify

Site de produção: [`jeverdias.netlify.app`](https://jeverdias.netlify.app)

No VS Code, pressione `Ctrl + Shift + P`, escolha **Tasks: Run Task** e use:

- **Gerar versão para deploy** para validar a versão publicada;
- **Abrir deploy no Netlify** para abrir o painel do projeto `jeverdias`.

Também é possível dar dois cliques em `abrir-deploy-netlify.cmd`.

O projeto local está vinculado ao site `jeverdias` no Netlify. O comando de build é `npm run build` e a pasta publicada é `dist`.

O arquivo `netlify.toml` contém essas configurações. O deploy contínuo está ligado ao repositório `jeverdias/portfolio-jever-dias`: somente atualizações enviadas à branch `main` publicam uma nova versão de produção. Deploys manuais de produção estão bloqueados no Netlify.

## Decisão sobre o modelo

Vite + React é o melhor encaixe para esta etapa: o portfólio é uma página rápida, sem necessidade de renderização no servidor, simples de manter e com publicação direta no Netlify. Next.js seria útil se o projeto passasse a exigir conteúdo dinâmico no servidor, autenticação real ou muitas páginas geradas por dados.
