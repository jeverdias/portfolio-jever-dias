# Portfólio Jever Dias

**Classificação:** aplicação web de portfólio profissional com landing page pública e painel administrativo.

O projeto foi desenvolvido em React + Vite, inspirado em uma landing page dark com azul e roxo. Está preparado para publicação no Netlify e possui um painel administrativo para cadastrar projetos, capas e links sem alterar a interface manualmente.

Categorias recomendadas no GitHub e em serviços de hospedagem: **Portfolio Website** e **Web Application**.

Site publicado: [`jeverdias.netlify.app`](https://jeverdias.netlify.app)

## Onde está o projeto

Pasta local:

```text
C:\Users\jever\Documents\Site JD
```

Versão atual e próximos passos: [`docs/MEMORIA_DO_PROJETO.md`](docs/MEMORIA_DO_PROJETO.md).

Documentação técnica: [`docs/DOCUMENTACAO_TECNICA_SITE_JD.md`](docs/DOCUMENTACAO_TECNICA_SITE_JD.md) · [PDF](docs/generated/documentacao-tecnica-site-jd-v1.8.1.pdf).

Versão do aplicativo: **v1.8.1**. A regra permanente de atualização MAJOR, MINOR e PATCH está em [`docs/VERSIONAMENTO.md`](docs/VERSIONAMENTO.md).

## O que foi criado

- Header responsivo com navegação por seções.
- Hero com apresentação, chamadas para ação e resumo de experiência.
- Cards de especialidades.
- Projetos filtráveis por Power BI, sistema web, conteúdo digital e GPTs & Agentes de IA.
- Página individual e compartilhável para cada projeto, estruturada como estudo de caso.
- Campos de desafio, solução, resultado, duração e participação editáveis no painel.
- Otimização automática de capas e prints enviados, com conversão para WebP quando o arquivo fica mais leve.
- Biblioteca editável de tecnologias e figurinhas com busca, ícones prontos e envio de imagem própria.
- Tipos de projeto personalizados e reutilizáveis, criados diretamente na área Repositórios.
- Modelos de exibição personalizados, com comportamento-base e exclusão segura.
- Campo de status separado da área/categoria do projeto.
- Guia visual interno com mapeamento dos campos, explicações e imagens reais do site.
- Explicações das especialidades em linguagem simples, com exemplos para visitantes leigos.
- Modal para incorporar relatórios do Power BI sem mostrar o endereço ao visitante.
- Modal para visualizar sites e abrir o projeto em uma nova aba.
- Modo administrador local com PIN, cadastro, edição, ordenação, imagem, importação e exportação JSON.
- Layout responsivo para computador, tablet e celular.
- Configuração pronta para build e publicação no Netlify.
- Aba Classificação do site com 8 estruturas básicas. A classificação muda organização e conteúdo, enquanto cores, fontes e acabamento permanecem exclusivos da aba Aparência.
- Landing page com campos próprios para oferta, título, explicação, botão e benefícios.
- Caixa de mensagens no painel, com filtros, leitura, arquivamento e exclusão.
- Integração preparada com Supabase Auth, Database e Storage em projeto exclusivo.
- Componentes administrativos e modais carregados sob demanda para reduzir o JavaScript inicial.

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
2. Sem Supabase, defina `VITE_ADMIN_PIN` no arquivo `.env.local`; não existe PIN padrão embutido.
3. Com Supabase, entre com o email e a senha do administrador autorizado.
4. Use **Configurações** para editar apresentação, contatos, LinkedIn, Instagram, GitHub e números do site.
5. Use **Repositórios** para cadastrar projetos, estudos de caso, links, capa e até quatro prints.
6. Use **Box/figurinhas** para editar o box de tecnologias da página inicial, buscar ícones ou enviar uma imagem própria.
7. Use **Mensagens** para consultar os contatos enviados pelo formulário público.

Os dados são salvos automaticamente. Em **Repositórios**, o campo **Tipo do portfólio** permite selecionar um dos tipos existentes ou escrever um novo; o novo tipo passa a aparecer na lista lateral e nos filtros públicos. Em **Box/figurinhas**, imagens enviadas ficam guardadas na coleção para reutilização e podem ser excluídas.

O **Modelo de exibição** controla tecnicamente como a demonstração abre. Modelos personalizados podem ser criados a partir de um dos quatro comportamentos-base e podem ser excluídos quando não estiverem sendo usados. **Área/categoria** descreve o assunto ou setor do trabalho; **Status** registra se está Em andamento, Concluído, Em preparação etc.

A seção **Guia do site** funciona como manual interno, explicando cada área administrativa, onde os campos aparecem no site público e como funcionam links, demonstrações, imagens, salvamento e publicação.

Para mudar o PIN:

1. Copie `.env.example` para `.env`.
2. Altere `VITE_ADMIN_PIN`.
3. Reinicie o site local.

> O PIN é apenas uma alternativa local de desenvolvimento. No site publicado, a proteção correta usa Supabase Auth e políticas RLS.

### Organização dos repositórios

- **Power BI:** nome, tema, resumo, descrição, tecnologias, público, link incorporado e prints. O portfólio abre o relatório dentro do modal e não mostra botão com o link.
- **Sistema Web:** nome, tema, resumo, descrição, tecnologias, link do projeto, capa e prints.
- **Conteúdo Digital:** nome, tema, formato, público, resumo, link de leitura/download e prints. Exemplos: cartilhas, relatórios, infográficos, guias, apresentações e materiais interativos.
- **GPTs & Agentes de IA:** objetivo, contexto, instruções, recursos utilizados, supervisão necessária, limites, demonstração segura e prints.

### Precisa de banco de dados?

A versão atual continua funcionando sem banco para edição no próprio computador. Os dados ficam no armazenamento do navegador e podem ser exportados como backup JSON. A integração online já está preparada e o projeto Supabase exclusivo `site-jd` foi criado com senha técnica forte; a ativação final depende do cadastro do administrador e das variáveis do Netlify.

Para que o Login seja seguro e as alterações apareçam online para todos sem editar o código, a recomendação é usar:

- **Supabase Auth** para o Login;
- **Supabase Database** para textos, links, ordem e categorias;
- **Supabase Storage** para capas e prints.

As imagens não devem ser gravadas diretamente no banco. O banco guarda apenas os endereços dos arquivos armazenados no Storage. O plano técnico está em [`docs/PLANO_ADMIN_ONLINE.md`](docs/PLANO_ADMIN_ONLINE.md).

### Otimização de imagens

Ao enviar uma capa ou um print pelo painel, o navegador limita dimensões exageradas e tenta converter a imagem para WebP. A conversão só é usada quando produz um arquivo menor. Isso reduz o tempo de carregamento sem diminuir o tamanho visual do card; a imagem continua ocupando o mesmo espaço na tela.

### Estudos de caso e páginas individuais

Cada card abre um endereço próprio em `/portfolio/id-do-projeto`. A página apresenta contexto, público, duração, desafio, solução, resultado, participação, tecnologias, galeria e demonstração. O arquivo `netlify.toml` já direciona esses endereços para o aplicativo React no Netlify.

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

## Atividade programada do Supabase

O workflow de pulso a cada seis dias já foi preparado em `.github/workflows/supabase-keep-alive.yml`, mas ainda não está ativo. Ele só passa a executar depois de autorização para commit/push na `main` e da configuração dos Secrets no GitHub. O login, a gravação e o Storage também devem ser testados antes da ativação.

O checklist para essa etapa futura está em [`docs/GITHUB_SUPABASE_KEEP_ALIVE.md`](docs/GITHUB_SUPABASE_KEEP_ALIVE.md).

## Decisão sobre o modelo

Vite + React é o melhor encaixe para esta etapa: o portfólio é uma página rápida, sem necessidade de renderização no servidor, simples de manter e com publicação direta no Netlify. Next.js seria útil se o projeto passasse a exigir conteúdo dinâmico no servidor, autenticação real ou muitas páginas geradas por dados.
